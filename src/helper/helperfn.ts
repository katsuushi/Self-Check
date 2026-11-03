import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { db } from "@/db/client";
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

export const resetLoop = async (id: number, row: InferSelectModel<typeof habit>) => {
    await db.update(habit).set({ completed: false, prevLatestMark: row.latestMark }).where(eq(habit.id, id))
}

export const resetStreak = async (id: number, row: InferSelectModel<typeof habit>) => {
    // Missing history keys already mean "not completed", so there is no
    // history to write here. Keep latestMark as the real last mark.
    await db.update(habit).set({
        completed: false,
        streak: 0,
        prevLatestMark: row.latestMark,
    }).where(eq(habit.id, id))
}
