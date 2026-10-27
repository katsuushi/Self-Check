import { db } from "../db/client"
import { habit } from "@/db/schema"
import { normalizeHabitHistory } from "@/db/history"
import { eq } from "drizzle-orm"
import type { Result } from "@/types"
import { localISODate } from "@/app/helperfn"

export const onMarkHabit = async (id: number): Promise<Result> => {
    if (!id) return { success: false, error: "No id has been passed." }
    const [row] = await db.select().from(habit).where(eq(habit.id, id))
    let newStreak: number;
    let newLastCompleted: Date;
    const currentDate = new Date();
    const isoDate: string = localISODate();
    let newBestStreak = row.bestStreak
    if (!row) return { success: false, error: "Could not find the habit" }

    // Older builds stored history as an array. Convert it to the object map.
    const history = normalizeHabitHistory(row.habitHistory);

    if (row.completed) {
        newStreak = row.streak - 1
        if (row.bestStreak < newStreak) newBestStreak -= 1
        newLastCompleted = row.prevLastCompletion
        delete history[isoDate]
    } else {
        newStreak = row.streak + 1
        if (row.bestStreak < newStreak) newBestStreak += 1
        newLastCompleted = currentDate
        history[isoDate] = true
    }
    await db.update(habit).set({ streak: newStreak, bestStreak: newBestStreak, completed: !row.completed, lastCompleted: newLastCompleted, habitHistory: history }).where(eq(habit.id, id))

    return { success: true, data: { streak: newStreak, completed: !row.completed } }
}
