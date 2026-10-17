import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Success } from "./types/types"

export const updateHabitData = async (id: number): Promise<Success> => {
    if (!id) return { success: false, error: "No id has been passed." }

    const [row] = await db.select().from(habit).where(eq(habit.id, id))
    if (!row) return { success: false, error: "Could not find the habit" }
    let newStreak;
    let newLastCompleted;
    if (row.completed) {
        newStreak = row.streak - 1
        newLastCompleted = row.prevLastCompletion
    } else {
        newStreak = row.streak + 1
        newLastCompleted = new Date()
    }
    const res = await db.update(habit).set({ streak: newStreak, completed: !row.completed, lastCompleted: newLastCompleted }).where(eq(habit.id, id))

    return { success: true }
} 
