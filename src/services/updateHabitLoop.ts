import { db } from "../db/client"
import { habit } from "@/db/schema"
import { InferSelectModel } from "drizzle-orm"
import { eq } from "drizzle-orm"
import { Result } from "./types/types"

// This function checks whether a calendar day has passed
// Used for reseting the streak / setting the completion to false on a new day

export const updateHabitLoop = async (id: number): Promise<Result> => {
    if (!id) return { success: false, error: "No id has been passed." }

    const [row] = await db.select().from(habit).where(eq(habit.id, id))
    if (!row) return { success: false, error: "Could not find a habit matching the id" }

    const difference = timeDifference(row.lastCompleted);
    if (!difference) return { success: false, error: "timeDifference returned a falsy value. row.lastCompleted could be null." }
    console.log(`Days passed: ${difference}`)
    if (difference === 1) {
        resetLoop(id, row)
    }
    if (difference >= 2) {
        resetStreak(id)
    }
    if (difference >= 1) return { success: true, data: "true" };
    else return { success: true, data: "false" };
}

const timeDifference = (lastCompleted: Date) => {
    const getDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const daysBetween = Math.round((getDate(new Date()).getTime() - getDate(lastCompleted).getTime()) / 864e5)
    return daysBetween
}

const resetLoop = async (id: number, row: InferSelectModel<typeof habit>) => {
    await db.update(habit).set({ completed: false, prevLastCompletion: row.lastCompleted }).where(eq(habit.id, id))
}

const resetStreak = async (id: number) => {
    const date = new Date()
    await db.update(habit).set({ completed: false, streak: 0, lastCompleted: date, prevLastCompletion: date }).where(eq(habit.id, id))
}
