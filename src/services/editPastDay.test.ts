import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDb } from "@/test/fakeDb";
import { localISODate } from "@/helper/helperfn";
import { editPastDay } from "./editPastDay";

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
    latestMark: new Date(2026, 10, 5, 12),
    prevLatestMark: new Date(2026, 10, 1, 12),
    streak: 0,
    bestStreak: 0,
    createdAt: CREATED_AT,
    habitHistory: {},
    ...overrides,
});

describe("editPastDay", () => {
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

    it("marks today's yes/no habit complete and scopes the update to the habit", async () => {
        fakeDb.reset([makeRow()]);

        const result = await editPastDay(1, "2026-11-05", 1);

        expect(result).toMatchObject({
            success: true,
            data: {
                newStreak: 1,
                newBestStreak: 1,
                newHistory: { "2026-11-05": true },
            },
        });
        expect(fakeDb.updates).toHaveLength(1);

        const update = fakeDb.updates[0]!;
        expect(update.whereCalled).toBe(true);
        expect(update.whereArg).toBeDefined();
        expect(update.values.completed).toBe(true);
        expect(update.values.habitHistory).toEqual({ "2026-11-05": true });
        expect(update.values.streak).toBe(1);
        expect(update.values.bestStreak).toBe(1);
        expect(update.values.latestMark).toBeInstanceOf(Date);
        expect(localISODate(update.values.latestMark as Date)).toBe("2026-11-05");
    });

    it("stores a measurable amount and completes the habit when it meets the target", async () => {
        fakeDb.reset([makeRow({ habitType: "measurable", targetGoal: 5 })]);

        const result = await editPastDay(1, "2026-11-05", 1, 5);

        expect(result).toMatchObject({
            success: true,
            data: {
                newStreak: 1,
                newBestStreak: 1,
                newHistory: { "2026-11-05": 5 },
            },
        });
        expect(fakeDb.updates).toHaveLength(1);

        const update = fakeDb.updates[0]!;
        expect(update.whereCalled).toBe(true);
        expect(update.whereArg).toBeDefined();
        expect(update.values.completed).toBe(true);
        expect(update.values.habitHistory).toEqual({ "2026-11-05": 5 });
        expect(update.values.streak).toBe(1);
        expect(update.values.bestStreak).toBe(1);
    });

    it("stores a below-target amount and clears today's completion", async () => {
        fakeDb.reset([
            makeRow({
                habitType: "measurable",
                targetGoal: 5,
                completed: true,
                habitHistory: { "2026-11-05": true },
            }),
        ]);

        const result = await editPastDay(1, "2026-11-05", 1, 3);

        expect(result).toMatchObject({
            success: true,
            data: {
                newStreak: 0,
                newBestStreak: 0,
                newHistory: { "2026-11-05": 3 },
            },
        });
        expect(fakeDb.updates).toHaveLength(1);

        const update = fakeDb.updates[0]!;
        expect(update.values.completed).toBe(false);
        expect(update.values.habitHistory).toEqual({ "2026-11-05": 3 });
        expect(update.values.streak).toBe(0);
        expect(update.values.bestStreak).toBe(0);
    });

    it("preserves today's completion when editing a past day", async () => {
        fakeDb.reset([
            makeRow({
                completed: true,
                streak: 1,
                bestStreak: 1,
                habitHistory: { "2026-11-05": true },
            }),
        ]);

        const result = await editPastDay(1, "2026-11-04", 1);

        expect(result).toMatchObject({
            success: true,
            data: {
                newStreak: 2,
                newBestStreak: 2,
                newHistory: {
                    "2026-11-04": true,
                    "2026-11-05": true,
                },
            },
        });
        expect(fakeDb.updates).toHaveLength(1);

        const update = fakeDb.updates[0]!;
        expect(update.values.completed).toBe(true);
        expect(update.values.habitHistory).toEqual({
            "2026-11-04": true,
            "2026-11-05": true,
        });
        expect(update.values.streak).toBe(2);
        expect(update.values.bestStreak).toBe(2);
        expect(localISODate(update.values.latestMark as Date)).toBe("2026-11-05");
    });

    it("deletes today's mark and clears completion", async () => {
        fakeDb.reset([
            makeRow({
                completed: true,
                streak: 1,
                bestStreak: 1,
                habitHistory: { "2026-11-05": true },
            }),
        ]);

        const result = await editPastDay(1, "2026-11-05", 0);

        expect(result).toMatchObject({
            success: true,
            data: {
                newStreak: 0,
                newBestStreak: 0,
                newHistory: {},
            },
        });
        expect(fakeDb.updates).toHaveLength(1);

        const update = fakeDb.updates[0]!;
        expect(update.values.completed).toBe(false);
        expect(update.values.habitHistory).toEqual({});
        expect(update.values.streak).toBe(0);
        expect(update.values.bestStreak).toBe(0);
        expect(localISODate(update.values.latestMark as Date)).toBe("2026-11-01");
    });

    it("marks today's habit skipped and clears completion", async () => {
        fakeDb.reset([
            makeRow({
                completed: true,
                streak: 1,
                bestStreak: 1,
                habitHistory: { "2026-11-05": true },
            }),
        ]);

        const result = await editPastDay(1, "2026-11-05", 2);

        expect(result).toMatchObject({
            success: true,
            data: {
                newStreak: 0,
                newBestStreak: 0,
                newHistory: { "2026-11-05": false },
            },
        });
        expect(fakeDb.updates).toHaveLength(1);

        const update = fakeDb.updates[0]!;
        expect(update.values.completed).toBe(false);
        expect(update.values.habitHistory).toEqual({ "2026-11-05": false });
        expect(update.values.streak).toBe(0);
        expect(update.values.bestStreak).toBe(0);
    });

    it("rejects a measurable completion without a valid amount", async () => {
        fakeDb.reset([makeRow({ habitType: "measurable", targetGoal: 5 })]);

        const result = await editPastDay(1, "2026-11-05", 1);

        expect(result).toEqual({
            success: false,
            error: "Habit is measurable, but the amount is invalid.",
        });
        expect(fakeDb.updates).toHaveLength(0);
    });

    it("rejects a non-positive measurable amount", async () => {
        fakeDb.reset([makeRow({ habitType: "measurable", targetGoal: 5 })]);

        const result = await editPastDay(1, "2026-11-05", 1, -1);

        expect(result).toEqual({
            success: false,
            error: "Habit is measurable, but the amount is invalid.",
        });
        expect(fakeDb.updates).toHaveLength(0);
    });

    it("returns an error when the habit does not exist", async () => {
        fakeDb.reset([]);

        const result = await editPastDay(1, "2026-11-05", 1);

        expect(result).toEqual({
            success: false,
            error: "No habit found with the requested id.",
        });
        expect(fakeDb.updates).toHaveLength(0);
    });

    it("rejects invalid input before querying the database", async () => {
        const result = await editPastDay(0, "2026-11-05", 1);

        expect(result).toEqual({
            success: false,
            error: "Id / Date value hasn't be put or is invalid",
        });
        expect(fakeDb.selectWhereCalled).toBe(false);
    });
});
