import { db } from "@/db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { Result } from "@/types"
import { applyHistoryValue } from "@/helper/helperfn"
import { calculateNewStreak } from "@/helper/calculateNewStreak"

export const onMarkHabit = async (id: number, value: 0 | 1): Promise<Result> => {
    if (!id) return { success: false, error: "No id has been passed." }
    if (value !== 0 && value !== 1) return { success: false, error: "The value parameter is invalid." }

    const [row] = await db.select().from(habit).where(eq(habit.id, id))
    if (!row) return { success: false, error: "Could not find the habit" }

    let newStreak: number = row.streak;
    let newBestStreak: number = row.bestStreak;
    let newLatestMark: Date;
    const history = applyHistoryValue(row.habitHistory, value);

    if (value === 0) {
        newLatestMark = row.prevLatestMark
    } else {
        newLatestMark = new Date()
    }

    const newStreaks = calculateNewStreak(history, row.createdAt)
    newBestStreak = newStreaks.newBestStreak
    newStreak = newStreaks.newStreak
    await db.update(habit).set({
        streak: newStreak,
        bestStreak: newBestStreak,
        completed: value === 1,
        latestMark: newLatestMark,
        habitHistory: history
    }).where(eq(habit.id, id))

    return { success: true, data: { streak: newStreak, completed: value === 1 } }
}
