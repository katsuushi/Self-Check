import { eq } from "drizzle-orm";
import type { InferSelectModel } from "drizzle-orm";
import { db } from "@/db/client";
import { habit } from "@/db/schema";
import type { HabitHistory, NewStreaks } from "@/types";

export function localISODate(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}

export const applyHistoryValue = (
    habitHistory: HabitHistory,
    value: number,
    isoDate = localISODate()
): HabitHistory => {
    const history = { ...habitHistory };

    if (value === 1) {
        history[isoDate] = true;
    } else if (value === 0 && isoDate in history) {
        delete history[isoDate];
    } else {
        history[isoDate] = false;
    }

    return history;
}

export const calculateNewStreak = (
    history: HabitHistory,
    createdAt: string,
    target: boolean | number = false,
    currentDate = new Date(),
): NewStreaks => {
    let runStreak = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let foundCurrent = false;

    const start = createdAt.slice(0, 10)
    const date = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()))
    const today = localISODate()
    let isoDate: string;
    do {
        isoDate = date.toISOString().slice(0, 10)
        if (isoDate in history) {
            if (history[isoDate] === true || history[isoDate] >= target) runStreak += 1
            // target != 0 means the habit is measurable
            else if (target != 0) {
                ({ runStreak, currentStreak, bestStreak, foundCurrent } = endRun(runStreak, currentStreak, bestStreak, foundCurrent, isoDate, today))
            }
        }
        else {
            ({ runStreak, currentStreak, bestStreak, foundCurrent } = endRun(runStreak, currentStreak, bestStreak, foundCurrent, isoDate, today))
        }
        if (isoDate === start) {
            ({ runStreak, currentStreak, bestStreak, foundCurrent } = endRun(runStreak, currentStreak, bestStreak, foundCurrent, isoDate, today))
        }
        date.setUTCDate(date.getUTCDate() - 1)
    } while (isoDate > start)

    return { newStreak: currentStreak, newBestStreak: bestStreak }
}

const endRun = (runStreak: number, currentStreak: number, bestStreak: number, foundCurrent: boolean, isoDate: string, today: string) => {
    if (!foundCurrent && isoDate != today) {
        currentStreak = runStreak
        foundCurrent = true
    }
    if (runStreak > bestStreak) {
        bestStreak = runStreak
    }
    return { runStreak: 0, currentStreak: currentStreak, bestStreak: bestStreak, foundCurrent: foundCurrent }
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
