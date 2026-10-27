import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { ReturnFromEditDay } from "@/types"
import { calculateNewStreak } from "@/app/helperfn"

export const editPastDay = async (id: number, date: string, value: boolean): Promise<ReturnFromEditDay> => {

    if (!id || !date) return { success: false, error: "Id / Date value hasn't be put or is invalid" }

    const [row] = await db.select().from(habit).where(eq(habit.id, id));
    if (!row) return { success: false, error: "No habit found with the requested id." }
    const newHistory = row.habitHistory;


    if (date in newHistory) {
        delete newHistory[date];
    } else if (!(date in newHistory) && value) {
        newHistory[date] = true;
    }
    const newStreaks = calculateNewStreak(newHistory, row.createdAt.toISOString())


    await db.update(habit).set({ streak: newStreaks.newStreak, bestStreak: newStreaks.newBestStreak, habitHistory: newHistory })

    return { success: true, data: { newStreak: newStreaks.newStreak, newBestStreak: newStreaks.newBestStreak, newHistory: newHistory } }
}
