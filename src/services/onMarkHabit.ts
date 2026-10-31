import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { Result } from "@/types"
import { calculateNewStreak, localISODate } from "@/helperfn"

export const onMarkHabit = async (id: number): Promise<Result> => {
    if (!id) return { success: false, error: "No id has been passed." }
    const [row] = await db.select().from(habit).where(eq(habit.id, id))
    let newStreak: number = row.streak;
    let newLatestMark: Date;
    const currentDate = new Date();
    const isoDate: string = localISODate();
    let newBestStreak: number = row.bestStreak;
    if (!row) return { success: false, error: "Could not find the habit" }

    const history = { ...row.habitHistory };

    if (row.completed) {
        newLatestMark = row.prevLatestMark
        delete history[isoDate]
        const newStreaks = calculateNewStreak(history, row.createdAt.toISOString())
        newBestStreak = newStreaks.newBestStreak
        newStreak = newStreaks.newStreak

    } else {
        newStreak = row.streak + 1
        if (row.bestStreak < newStreak) newBestStreak += 1
        newLatestMark = currentDate
        history[isoDate] = true
    }
    await db.update(habit).set({ streak: newStreak, bestStreak: newBestStreak, completed: !row.completed, latestMark: newLatestMark, habitHistory: history }).where(eq(habit.id, id))

    return { success: true, data: { streak: newStreak, completed: !row.completed } }
}
