import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { Success } from "@/types"

export const updateHabit = async (id: number, title: string, description: string, color: string): Promise<Success> => {

    if (!id || !title || !color) {
        return { success: false, error: "One of the fields is missing" }
    }

    const res = await db.update(habit).set({ title: title, description: description, color: color }).where(eq(habit.id, id))
    if (res.changes === 0) {
        return { success: false, error: "No rows were affected, the id you passed could be invalid." }
    }
    return { success: true }
}
