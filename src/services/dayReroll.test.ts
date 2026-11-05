import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fakeDb } from "@/test/fakeDb";
import { dayReroll } from "./dayReroll";

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
    completed: true,
    latestMark: new Date(2026, 10, 4, 12),
    prevLatestMark: new Date(2026, 10, 3, 12),
    streak: 5,
    bestStreak: 7,
    createdAt: CREATED_AT,
    habitHistory: {},
    ...overrides,
});

describe("dayReroll", () => {
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

    it("resets completion but keeps the streak when the last mark was yesterday", async () => {
        const latestMark = new Date(2026, 10, 4, 12);
        fakeDb.reset([makeRow({ latestMark })]);

        const result = await dayReroll();

        expect(result).toEqual({ success: true });
        expect(fakeDb.transactionCommitted).toBe(true);
        expect(fakeDb.transactionRolledBack).toBe(false);
        expect(fakeDb.updates).toHaveLength(1);

        const update = fakeDb.updates[0]!;
        expect(update.whereCalled).toBe(true);
        expect(update.whereArg).toBeDefined();
        expect(update.values).toEqual({
            completed: false,
            prevLatestMark: latestMark,
        });
    });

    it("resets the streak when the last mark is at least two days old", async () => {
        const latestMark = new Date(2026, 10, 3, 12);
        fakeDb.reset([makeRow({ latestMark })]);

        const result = await dayReroll();

        expect(result).toEqual({ success: true });
        expect(fakeDb.transactionCommitted).toBe(true);
        expect(fakeDb.updates).toHaveLength(1);

        const update = fakeDb.updates[0]!;
        expect(update.values).toEqual({
            completed: false,
            streak: 0,
            prevLatestMark: latestMark,
        });
    });

    it("does nothing when the habit was already marked today", async () => {
        fakeDb.reset([makeRow({ latestMark: new Date(2026, 10, 5, 8) })]);

        const result = await dayReroll();

        expect(result).toEqual({ success: true });
        expect(fakeDb.transactionCommitted).toBe(true);
        expect(fakeDb.transactionRolledBack).toBe(false);
        expect(fakeDb.updates).toHaveLength(0);
    });

    it("rolls back when a latestMark is invalid", async () => {
        fakeDb.reset([makeRow({ latestMark: new Date("not a date") })]);

        const result = await dayReroll();

        expect(result).toEqual({
            success: false,
            error: "The dayReroll transaction failed.",
        });
        expect(fakeDb.transactionRolledBack).toBe(true);
        expect(fakeDb.transactionCommitted).toBe(false);
        expect(fakeDb.updates).toHaveLength(0);
    });

    it("rolls back updates made before an invalid row", async () => {
        fakeDb.reset([
            makeRow({ id: 1, latestMark: new Date(2026, 10, 4, 12) }),
            makeRow({ id: 2, latestMark: new Date("not a date") }),
        ]);

        const result = await dayReroll();

        expect(result).toEqual({
            success: false,
            error: "The dayReroll transaction failed.",
        });
        expect(fakeDb.transactionRolledBack).toBe(true);
        expect(fakeDb.updates).toHaveLength(0);
    });

    it("processes multiple habits in a single transaction", async () => {
        const yesterday = new Date(2026, 10, 4, 12);
        const twoDaysAgo = new Date(2026, 10, 3, 12);
        fakeDb.reset([
            makeRow({ id: 1, latestMark: yesterday }),
            makeRow({ id: 2, latestMark: twoDaysAgo }),
            makeRow({ id: 3, latestMark: new Date(2026, 10, 5, 8) }),
        ]);

        const result = await dayReroll();

        expect(result).toEqual({ success: true });
        expect(fakeDb.transactionCommitted).toBe(true);
        expect(fakeDb.updates).toHaveLength(2);
        expect(fakeDb.updates[0]!.values).toEqual({
            completed: false,
            prevLatestMark: yesterday,
        });
        expect(fakeDb.updates[1]!.values).toEqual({
            completed: false,
            streak: 0,
            prevLatestMark: twoDaysAgo,
        });
    });
});
