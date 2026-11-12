import { asc } from "drizzle-orm"
import { db } from "../db/client"
import { habit } from "@/db/schema"

export const listHabits = async () => {
    try {
        return await db.select().from(habit).orderBy(asc(habit.id))
    } catch {
        return [];
    }
} 
