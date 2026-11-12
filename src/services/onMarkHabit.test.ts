import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDb } from "@/test/fakeDb";
import { onMarkHabit } from "./onMarkHabit";

vi.mock("@/db/client", async () => {
    const { fakeDb } = await import("@/test/fakeDb");
    return { db: fakeDb, HabitTx: {} };
});

const NOW = new Date(2026, 10, 5, 12, 0, 0);
const CREATED_AT = new Date(Date.UTC(2026, 10, 1, 12, 0, 0));

const makeRow = (overrides: Record<string, unknown> = {}): Record<string, unknown> => ({
    id: 1,
    title: "Test habit",
    description: null,
    color: "#22d3ee",
    habitType: "yesNo",
    targetGoal: 0,
    completed: false,
    latestMark: new Date(2026, 10, 4, 12),
    prevLatestMark: new Date(2026, 10, 3, 12),
    streak: 2,
    bestStreak: 2,
    createdAt: CREATED_AT,
    habitHistory: {
        "2026-11-03": true,
        "2026-11-04": true,
    },
    ...overrides,
});

describe("onMarkHabit", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
        vi.spyOn(console, "log").mockImplementation(() => {});
        fakeDb.reset();
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("marks a yes/no habit complete and recalculates the streak", async () => {
        fakeDb.reset([makeRow()]);

        const result = await onMarkHabit(1, 1);

        expect(result).toEqual({
            success: true,
            data: { streak: 3, completed: true },
        });
        expect(fakeDb.updates).toHaveLength(1);

        const update = fakeDb.updates[0]!;
        expect(update.whereCalled).toBe(true);
        expect(update.whereArg).toBeDefined();
        expect(update.values.streak).toBe(3);
        expect(update.values.bestStreak).toBe(3);
        expect(update.values.completed).toBe(true);
        expect(update.values.habitHistory).toEqual({
            "2026-11-03": true,
            "2026-11-04": true,
            "2026-11-05": true,
        });
        expect((update.values.latestMark as Date).getTime()).toBe(NOW.getTime());
    });

    it("unmarks a habit and recalculates the streak from history", async () => {
        const prevLatestMark = new Date(2026, 10, 3, 12);
        fakeDb.reset([
            makeRow({
                completed: true,
                streak: 1,
                bestStreak: 3,
                prevLatestMark,
                habitHistory: {
                    "2026-11-01": true,
                    "2026-11-02": true,
                    "2026-11-03": true,
                    "2026-11-05": true,
                },
            }),
        ]);

        const result = await onMarkHabit(1, 0);

        expect(result).toEqual({
            success: true,
            data: { streak: 0, completed: false },
        });
        expect(fakeDb.updates).toHaveLength(1);

        const update = fakeDb.updates[0]!;
        expect(update.whereCalled).toBe(true);
        expect(update.values.completed).toBe(false);
        expect(update.values.streak).toBe(0);
        expect(update.values.bestStreak).toBe(3);
        expect(update.values.habitHistory).toEqual({
            "2026-11-01": true,
            "2026-11-02": true,
            "2026-11-03": true,
        });
        expect(update.values.latestMark).toBe(prevLatestMark);
    });

    it("recalculates the best streak from history when marking complete", async () => {
        fakeDb.reset([makeRow({ bestStreak: 5 })]);

        const result = await onMarkHabit(1, 1);

        expect(result).toEqual({
            success: true,
            data: { streak: 3, completed: true },
        });
        expect(fakeDb.updates[0]!.values.bestStreak).toBe(3);
    });

    it("returns an error when the habit does not exist", async () => {
        fakeDb.reset([]);

        const result = await onMarkHabit(1, 1);

        expect(result).toEqual({
            success: false,
            error: "Could not find the habit",
        });
        expect(fakeDb.updates).toHaveLength(0);
    });

    it("rejects invalid input before querying the database", async () => {
        const result = await onMarkHabit(0, 1);

        expect(result).toEqual({
            success: false,
            error: "No id has been passed.",
        });
        expect(fakeDb.selectWhereCalled).toBe(false);
    });
});
