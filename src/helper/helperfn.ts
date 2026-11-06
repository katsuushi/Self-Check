import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { db, HabitTx } from "@/db/client";
import { habit } from "@/db/schema";
import type { HabitHistory } from "@/types";

export function localISODate(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export const applyHistoryValue = (
    habitHistory: HabitHistory,
    value: number,
    amount?: number,
    isoDate = localISODate()
): HabitHistory => {
    const history = { ...habitHistory };
    if (value === 1) {
        history[isoDate] = (amount ? amount : true);
    } else if (value === 0 && isoDate in history) {
        delete history[isoDate];
    } else if (value === 2) {
        history[isoDate] = false;
    }

    return history;
}

export const timeDifference = (latestMark: Date): number => {
    if (Number.isNaN(latestMark.getTime())) return NaN;

    const localDay = (d: Date) =>
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

    return Math.round((localDay(new Date()) - localDay(latestMark)) / 864e5);
};

export const resetLoop = (tx: HabitTx, row: InferSelectModel<typeof habit>) => {
    tx.update(habit).set({ completed: false, prevLatestMark: row.latestMark }).where(eq(habit.id, row.id)).run();
}

export const resetStreak = (tx: HabitTx, row: InferSelectModel<typeof habit>) => {
    tx.update(habit).set({
        completed: false,
        streak: 0,
        prevLatestMark: row.latestMark,
    }).where(eq(habit.id, row.id)).run()
}

export const calculateTotalUnits = (history: HabitHistory) => {
    let totalUnits = 0;
    for (const date in history) {
        console.log(history[date])
        if (typeof history[date] === "number") {
            totalUnits += history[date]
        }
    }
    return Number(totalUnits.toFixed(2))
}
