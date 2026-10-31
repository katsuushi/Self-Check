import { eq } from "drizzle-orm"
import { db } from "../db/client"
import type { HabitRow, ReturnData } from "@/types"
import { habit } from "@/db/schema"

export const getHabit = async (id: number): Promise<ReturnData<HabitRow>> => {
    if (!id) return { success: false, error: "You haven't passed an id!" }

    const [row] = await db.select().from(habit).where(eq(habit.id, id));
    if (!row) return { success: false, error: "Didn't find a row, the id may be invalid" }
    return { success: true, data: row }
}
