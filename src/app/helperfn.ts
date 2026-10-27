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

export const calculateNewStreak = (
    history: HabitHistory,
    createdAt: string,
    currentDate = new Date()
): NewStreaks => {
    let runStreak = 0;
    let currentStreak = 0;
    let newBestStreak = 0;
    let foundCurrent = false;
    const start = createdAt.slice(0, 10)
    const date = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()))
    const today = date.toISOString().slice(0, 10)
    let isoDate: string;
    do {
        isoDate = date.toISOString().slice(0, 10)
        if (isoDate in history) runStreak += 1
        else {
            if (runStreak > newBestStreak) {
                newBestStreak = runStreak
            }
            if (!foundCurrent && isoDate != today) {
                currentStreak = runStreak
                foundCurrent = true
            }
            runStreak = 0
        }
        if (isoDate === start) {
            if (!foundCurrent) currentStreak = runStreak
            if (runStreak > newBestStreak) {
                newBestStreak = runStreak
            }
        }
        date.setUTCDate(date.getUTCDate() - 1)
    } while (isoDate > start)

    return { newStreak: currentStreak, newBestStreak: newBestStreak }
}

export const timeDifference = (lastCompleted: Date): number => {
    if (Number.isNaN(lastCompleted.getTime())) return NaN;

    const localDay = (d: Date) =>
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

    return Math.round((localDay(new Date()) - localDay(lastCompleted)) / 864e5);
};

export const resetLoop = async (id: number, row: InferSelectModel<typeof habit>) => {
    await db.update(habit).set({ completed: false, prevLastCompletion: row.lastCompleted }).where(eq(habit.id, id))
}

export const resetStreak = async (id: number, row: InferSelectModel<typeof habit>) => {
    // Missing history keys already mean "not completed", so there is no
    // history to write here. Keep lastCompleted as the real last completion.
    await db.update(habit).set({
        completed: false,
        streak: 0,
        prevLastCompletion: row.lastCompleted,
    }).where(eq(habit.id, id))
}
