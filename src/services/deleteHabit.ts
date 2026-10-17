import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import { Success } from "./types/types"

export const deleteHabit = async (id: number): Promise<Success> => {
    if (!id) return { success: false, error: "Id field is empty" }
    const res = await db.delete(habit).where(eq(habit.id, id))
    if (res.changes === 0) {
        return { success: false, error: "No rows were affected, the id you passed could be invalid." }
    }
    return { success: true }
} 
