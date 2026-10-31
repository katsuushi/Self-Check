import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { DayStatus, ReturnFromEditDay } from "@/types"
import { calculateNewStreak, localISODate } from "@/helperfn"

export const editPastDay = async (id: number, date: string, value: DayStatus): Promise<ReturnFromEditDay> => {

    if (!id || !date) return { success: false, error: "Id / Date value hasn't be put or is invalid" }
    if (value !== 0 && value !== 1 && value !== 2) return { success: false, error: "The value parameter is invalid." }
    const [row] = await db.select().from(habit).where(eq(habit.id, id));
    if (!row) return { success: false, error: "No habit found with the requested id." }
    const newHistory = { ...row.habitHistory };
    const today = localISODate()
    const newCompleted = date === today ? value === 1 : row.completed;

    console.log(value)

    if (value === 0) {
        delete newHistory[date];
    } else if (value === 1) {
        newHistory[date] = true;
    } else {
        newHistory[date] = false;
    }

    const latestMarkDate = Object.keys(newHistory).sort().at(-1)
    let newLatestMark: Date;
    if (latestMarkDate) {
        const [year, month, day] = latestMarkDate.split("-").map(Number);
        newLatestMark = new Date(year, month - 1, day, 12)
    } else {
        newLatestMark = row.prevLatestMark
    }

    const newStreaks = calculateNewStreak(newHistory, row.createdAt.toISOString())

    await db.update(habit).set({ completed: newCompleted, latestMark: newLatestMark, streak: newStreaks.newStreak, bestStreak: newStreaks.newBestStreak, habitHistory: newHistory })
    console.log(`newStreak: ${newStreaks.newStreak}`)

    return { success: true, data: { newStreak: newStreaks.newStreak, newBestStreak: newStreaks.newBestStreak, newHistory: newHistory } }
}
