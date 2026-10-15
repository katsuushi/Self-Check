import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"

export const deleteHabit = async (id: number) => {
    const res = await db.delete(habit).where(eq(habit.id, id))
    console.log(res)
    return res
} 
