import { db } from "../db/client"
import { habit } from "@/db/schema"

export const listHabits = async () => {
    const res = await db.select().from(habit)
    console.log(res)
    return res
} 
