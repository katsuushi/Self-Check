import { asc } from "drizzle-orm"
import { db } from "../db/client"
import { habit } from "@/db/schema"
import { normalizeHabitHistory } from "@/db/history"

export const listHabits = async () => {
    let res;
    try {
        res = await db.select().from(habit).orderBy(asc(habit.id))
    } catch (error) {
        console.log(error)
        console.log(res)
        return [];
    }
    return res.map((row) => ({ ...row, habitHistory: normalizeHabitHistory(row.habitHistory) }))
} 
