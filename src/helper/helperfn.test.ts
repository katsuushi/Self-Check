import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { applyHistoryValue, localISODate, timeDifference } from "./helperfn";

vi.mock("@/db/client", () => ({
    db: {},
    HabitTx: {},
}));

const NOW = new Date(2026, 10, 5, 15, 30, 0);

describe("localISODate", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("formats a date as YYYY-MM-DD", () => {
        expect(localISODate(new Date(2026, 10, 5, 12))).toBe("2026-11-05");
    });

    it("zero-pads single-digit months and days", () => {
        expect(localISODate(new Date(2026, 0, 2, 12))).toBe("2026-01-02");
    });

    it("handles leap days", () => {
        expect(localISODate(new Date(2024, 1, 29, 12))).toBe("2024-02-29");
    });

    it("uses the local date rather than the UTC date", () => {
        expect(localISODate(new Date(2026, 0, 2, 23, 30))).toBe("2026-01-02");
    });

    it("uses the current date by default", () => {
        expect(localISODate()).toBe("2026-11-05");
    });
});

describe("applyHistoryValue", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("marks a day complete with true when no amount is provided", () => {
        expect(applyHistoryValue({}, 1, undefined, "2026-11-05")).toEqual({
            "2026-11-05": true,
        });
    });

    it("stores a measurable amount for a completed day", () => {
        expect(applyHistoryValue({}, 1, 2.5, "2026-11-05")).toEqual({
            "2026-11-05": 2.5,
        });
    });

    it("falls back to true when the amount is 0", () => {
        expect(applyHistoryValue({}, 1, 0, "2026-11-05")).toEqual({
            "2026-11-05": true,
        });
    });

    it("deletes an existing day when value is 0", () => {
        expect(applyHistoryValue({ "2026-11-05": true }, 0, undefined, "2026-11-05")).toEqual({});
    });

    it("deletes an existing skipped day when value is 0", () => {
        expect(applyHistoryValue({ "2026-11-05": false }, 0, undefined, "2026-11-05")).toEqual({});
    });

    it("does nothing when value is 0 and the day is missing", () => {
        expect(applyHistoryValue({}, 0, undefined, "2026-11-05")).toEqual({});
    });

    it("marks a day skipped when value is 2", () => {
        expect(applyHistoryValue({}, 2, undefined, "2026-11-05")).toEqual({
            "2026-11-05": false,
        });
    });

    it("overwrites an existing value with a new measurable amount", () => {
        expect(applyHistoryValue({ "2026-11-05": 2 }, 1, 4, "2026-11-05")).toEqual({
            "2026-11-05": 4,
        });
    });

    it("overwrites an existing value with a skip", () => {
        expect(applyHistoryValue({ "2026-11-05": 5 }, 2, undefined, "2026-11-05")).toEqual({
            "2026-11-05": false,
        });
    });

    it("overwrites an existing skip with a completed value", () => {
        expect(applyHistoryValue({ "2026-11-05": false }, 1, undefined, "2026-11-05")).toEqual({
            "2026-11-05": true,
        });
    });

    it("preserves other history entries", () => {
        expect(
            applyHistoryValue(
                {
                    "2026-11-04": true,
                    "2026-11-05": 3,
                },
                0,
                undefined,
                "2026-11-05"
            )
        ).toEqual({
            "2026-11-04": true,
        });
    });

    it("does not mutate the input history", () => {
        const history = { "2026-11-05": 3 };
        const result = applyHistoryValue(history, 0, undefined, "2026-11-05");

        expect(result).not.toBe(history);
        expect(history).toEqual({ "2026-11-05": 3 });
    });

    it("uses the current local date when isoDate is omitted", () => {
        expect(applyHistoryValue({}, 1)).toEqual({
            "2026-11-05": true,
        });
    });

    it("ignores values outside 0, 1, and 2", () => {
        expect(applyHistoryValue({ "2026-11-04": true }, 3, undefined, "2026-11-05")).toEqual({
            "2026-11-04": true,
        });
    });
});

describe("timeDifference", () => {
    beforeEach(() => {
        vi.useFakeTimers();
        vi.setSystemTime(NOW);
    });

    afterEach(() => {
        vi.useRealTimers();
        vi.restoreAllMocks();
    });

    it("returns 0 for the same local day", () => {
        expect(timeDifference(new Date(2026, 10, 5, 0, 1))).toBe(0);
    });

    it("returns 0 for a later time on the same local day", () => {
        expect(timeDifference(new Date(2026, 10, 5, 23, 59))).toBe(0);
    });

    it("returns 1 for yesterday", () => {
        expect(timeDifference(new Date(2026, 10, 4, 23, 59))).toBe(1);
    });

    it("returns the number of calendar days for older dates", () => {
        expect(timeDifference(new Date(2026, 10, 3, 12))).toBe(2);
    });

    it("returns a negative number for a future date", () => {
        expect(timeDifference(new Date(2026, 10, 6, 12))).toBe(-1);
    });

    it("handles month and year boundaries", () => {
        expect(timeDifference(new Date(2025, 11, 31, 12))).toBe(309);
    });

    it("returns NaN for an invalid date", () => {
        expect(Number.isNaN(timeDifference(new Date("not a date")))).toBe(true);
    });
});
