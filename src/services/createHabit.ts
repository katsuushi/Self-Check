import { db } from "../db/client"
import { habit } from "@/db/schema"
import type { Success } from "@/types"

export const createHabit = async (title: string, description: string, color: string): Promise<Success> => {

    if (!title || !color) {
        return { success: false, error: "One of the fields is missing" }
    }

    const date = new Date()
    try {
        await db.insert(habit).values({ title: title, description: description, color: color, latestMark: date, prevLatestMark: date, createdAt: date, habitHistory: {} })
    } catch (error) {
        return {success: false, error: "Inserting into database failed"}
    }
    return { success: true }
} 
