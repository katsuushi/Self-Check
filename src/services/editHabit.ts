import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { HabitType, Success } from "@/types"

export const updateHabit = async (
    id: number,
    title: string,
    description: string,
    color: string,
    habitType: HabitType,
    targetGoal: number
): Promise<Success> => {

    if (!id || !title || !color || !habitType) {
        return { success: false, error: "One of the fields is missing" }
    }

    const normalizedType: HabitType =
        habitType === "measurable" ? "measurable" : "yesNo"
    // Keep the target for yesNo habits too; it may be needed later.
    const normalizedTarget = Number.isFinite(targetGoal) ? targetGoal : 0

    const res = await db
        .update(habit)
        .set({
            title: title,
            description: description,
            color: color,
            habitType: normalizedType,
            targetGoal: normalizedTarget,
        })
        .where(eq(habit.id, id))
    if (res.changes === 0) {
        return { success: false, error: "No rows were affected, the id you passed could be invalid." }
    }
    return { success: true }
}
