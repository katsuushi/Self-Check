import { db } from "../db/client"
import { habit } from "@/db/schema"
import type { HabitType, Success } from "@/types"

export const createHabit = async (
    title: string,
    description: string,
    color: string,
    habitType: HabitType,
    targetGoal: number
): Promise<Success> => {

    if (!title || !color || !habitType) {
        return { success: false, error: "One of the fields is missing" }
    }

    const normalizedType: HabitType = habitType === "measurable" ? "measurable" : "yesNo"
    const normalizedTarget = Number.isFinite(targetGoal) ? targetGoal : 0

    const date = new Date()
    try {
        await db.insert(habit).values({
            title: title,
            description: description,
            color: color,
            habitType: normalizedType,
            targetGoal: normalizedTarget,
            latestMark: date,
            prevLatestMark: date,
            createdAt: date,
            habitHistory: {},
        })
    } catch (error) {
        return { success: false, error: "Inserting into database failed" }
    }
    return { success: true }
}
