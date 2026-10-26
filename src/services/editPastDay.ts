import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { ReturnFromEditDay, NewStreaks } from "@/types"

export const editPastDay = async (id: number, date: string, value: boolean): Promise<ReturnFromEditDay> => {

    if (!id || !date) return { success: false, error: "Id / Date value hasn't be put or is invalid" }

    const [row] = await db.select().from(habit).where(eq(habit.id, id));
    if (!row) return { success: false, error: "No habit found with the requested id." }
    const newHistory = row.habitHistory;

    console.log("edit past day!")

    if (date in newHistory) {
        console.log("deleting date")
        delete newHistory[date];
    } else if (!(date in newHistory) && value) {
        console.log("adding date")
        newHistory[date] = true;
    }
    const newStreaks: Record<string, number> = calculateNewStreak(newHistory, row.createdAt.toISOString())

    console.log(`New Streaks: ${newStreaks.newStreak} and new best: ${newStreaks.newBestStreak}`)

    await db.update(habit).set({ streak: newStreaks.newStreak, bestStreak: newStreaks.newBestStreak, habitHistory: newHistory })

    return { success: true, data: { newStreak: newStreaks.newStreak, newBestStreak: newStreaks.newBestStreak, newHistory: newHistory } }
}


const calculateNewStreak = (history: Record<string, boolean>, createdAt: string, currentDate = new Date()): NewStreaks => {
    let runStreak = 0;
    let currentStreak = 0;
    let newBestStreak = 0;
    let foundCurrent = false;
    const start = createdAt.slice(0, 10)
    const date = new Date(Date.UTC(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate()))
    const today = date.toISOString().slice(0, 10)
    let isoDate;
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
