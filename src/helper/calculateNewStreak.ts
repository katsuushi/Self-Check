import type { HabitHistory, NewStreaks } from "@/types";
import { localISODate } from "./helperfn";

export const calculateNewStreak = (
    history: HabitHistory,
    createdAt: Date,
    target: number = 0,
    currentDate = new Date(),
): NewStreaks => {
    let runStreak = 0;
    let currentStreak = 0;
    let bestStreak = 0;
    let foundCurrent = false;
    if (Number.isNaN(createdAt.getTime())) throw new Error("The createdAt date is invalid!")
    const start = localISODate(createdAt)
    const date = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()))
    const today = localISODate()
    let isoDate: string;
    do {
        isoDate = date.toISOString().slice(0, 10)
        if (isoDate in history) {
            const value = history[isoDate]
            if (typeof value === "boolean" && history[isoDate] === true || typeof value === "number" && value >= target) runStreak += 1
            // target != 0 means the habit is measurable
            else if (target != 0 && history[isoDate] !== false) {
                ({ runStreak, currentStreak, bestStreak, foundCurrent } = endRun(runStreak, currentStreak, bestStreak, foundCurrent, isoDate, today))
            }
        }
        else {
            ({ runStreak, currentStreak, bestStreak, foundCurrent } = endRun(runStreak, currentStreak, bestStreak, foundCurrent, isoDate, today))
        }

        if (isoDate === start) {
            if (!foundCurrent) currentStreak = runStreak
            if (runStreak > bestStreak) {
                bestStreak = runStreak
            }
        }
        date.setUTCDate(date.getUTCDate() - 1)
    } while (isoDate > start)

    return { newStreak: currentStreak, newBestStreak: bestStreak }
}

const endRun = (runStreak: number, currentStreak: number, bestStreak: number, foundCurrent: boolean, isoDate: string, today: string) => {
    if (!foundCurrent && isoDate !== today) {
        currentStreak = runStreak
        foundCurrent = true
    }
    if (runStreak > bestStreak) {
        bestStreak = runStreak
    }
    return { runStreak: 0, currentStreak: currentStreak, bestStreak: bestStreak, foundCurrent: foundCurrent }
}
