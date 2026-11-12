import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { calculateNewStreak } from "./calculateNewStreak";

vi.mock("@/db/client", () => ({
    db: {},
    HabitTx: {},
}));

const NOW = new Date(2026, 10, 5, 12, 0, 0);
const CREATED_AT = "2026-11-01";

describe("calculateNewStreak", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
        vi.spyOn(console, "log").mockImplementation(() => { });
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("returns zero for an empty history", () => {
        expect(calculateNewStreak({}, new Date(CREATED_AT), 0, NOW)).toEqual({
            newStreak: 0,
            newBestStreak: 0,
        });
    });

    it("counts consecutive completed days ending today", () => {
        const history = {
            "2026-11-04": true,
            "2026-11-05": true,
        };

        expect(calculateNewStreak(history, new Date(CREATED_AT), 0, NOW)).toEqual({
            newStreak: 2,
            newBestStreak: 2,
        });
    });

    it("counts the run ending yesterday when today is not marked", () => {
        const history = {
            "2026-11-03": true,
            "2026-11-04": true,
        };

        expect(calculateNewStreak(history, new Date(CREATED_AT), 0, NOW)).toEqual({
            newStreak: 2,
            newBestStreak: 2,
        });
    });

    it("resets the current streak after a missing day", () => {
        const history = {
            "2026-11-03": true,
            "2026-11-05": true,
        };

        expect(calculateNewStreak(history, new Date(CREATED_AT), 0, NOW)).toEqual({
            newStreak: 1,
            newBestStreak: 1,
        });
    });

    it("keeps the best streak from an earlier run", () => {
        const history = {
            "2026-11-01": true,
            "2026-11-02": true,
            "2026-11-03": true,
            "2026-11-05": true,
        };

        expect(calculateNewStreak(history, new Date(CREATED_AT), 0, NOW)).toEqual({
            newStreak: 1,
            newBestStreak: 3,
        });
    });

    it("returns a zero current streak when recent days are missing", () => {
        const history = {
            "2026-11-01": true,
            "2026-11-02": true,
        };

        expect(calculateNewStreak(history, new Date(CREATED_AT), 0, NOW)).toEqual({
            newStreak: 0,
            newBestStreak: 2,
        });
    });

    it("does not break a yes/no streak on a skipped day", () => {
        const history = {
            "2026-11-03": true,
            "2026-11-04": false,
            "2026-11-05": true,
        };

        expect(calculateNewStreak(history, new Date(CREATED_AT), 0, NOW)).toEqual({
            newStreak: 2,
            newBestStreak: 2,
        });
    });

    it("counts measurable values that meet the target", () => {
        const history = {
            "2026-11-03": 7,
            "2026-11-04": 5,
            "2026-11-05": 6,
        };

        expect(calculateNewStreak(history, new Date(CREATED_AT), 5, NOW)).toEqual({
            newStreak: 3,
            newBestStreak: 3,
        });
    });

    it("breaks a measurable streak when a value is below target", () => {
        const history = {
            "2026-11-03": 5,
            "2026-11-04": 3,
            "2026-11-05": 5,
        };

        expect(calculateNewStreak(history, new Date(CREATED_AT), 5, NOW)).toEqual({
            newStreak: 1,
            newBestStreak: 1,
        });
    });

    it("handles createdAt being today", () => {
        expect(calculateNewStreak({ "2026-11-05": true }, new Date("2026-11-05"), 0, NOW)).toEqual({
            newStreak: 1,
            newBestStreak: 1,
        });
    });

    it("returns zero when createdAt is today and the day is unmarked", () => {
        expect(calculateNewStreak({}, new Date("2026-11-05"), 0, NOW)).toEqual({
            newStreak: 0,
            newBestStreak: 0,
        });
    });

    it("ignores history before createdAt", () => {
        const history = {
            "2026-11-03": true,
            "2026-11-04": true,
            "2026-11-05": true,
        };

        expect(calculateNewStreak(history, new Date("2026-11-04"), 0, NOW)).toEqual({
            newStreak: 2,
            newBestStreak: 2,
        });
    });

    it("accepts a full ISO timestamp for createdAt", () => {
        expect(
            calculateNewStreak(
                { "2026-11-05": true },
                new Date("2026-11-01T12:00:00.000Z"),
                0,
                NOW
            )
        ).toEqual({
            newStreak: 1,
            newBestStreak: 1,
        });
    });
});
