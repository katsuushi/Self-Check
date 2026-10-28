import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { ReturnFromEditDay } from "@/types"
import { calculateNewStreak, localISODate } from "@/helperfn"

export const editPastDay = async (id: number, date: string, value: boolean): Promise<ReturnFromEditDay> => {

    if (!id || !date) return { success: false, error: "Id / Date value hasn't be put or is invalid" }

    const [row] = await db.select().from(habit).where(eq(habit.id, id));
    if (!row) return { success: false, error: "No habit found with the requested id." }
    const newHistory = row.habitHistory;
    let newCompleted;
    let newLastCompleted;


    const today = localISODate()

    console.log(value)

    if (date in newHistory && !value) {
        if (date === today) newCompleted = false;
        delete newHistory[date];
    } else if (!(date in newHistory) && value) {
        if (date === today) newCompleted = true;
        newHistory[date] = true;
    }
    const latestCompletion = Object.keys(newHistory).sort().at(-1)
    if (latestCompletion) {
        newLastCompleted = new Date(latestCompletion)
    } else newLastCompleted = row.prevLastCompletion
    const newStreaks = calculateNewStreak(newHistory, row.createdAt.toISOString())

    await db.update(habit).set({ completed: newCompleted, lastCompleted: newLastCompleted, streak: newStreaks.newStreak, bestStreak: newStreaks.newBestStreak, habitHistory: newHistory })
    console.log(`newStreak: ${newStreaks.newStreak}`)

    return { success: true, data: { newStreak: newStreaks.newStreak, newBestStreak: newStreaks.newBestStreak, newHistory: newHistory } }
}
