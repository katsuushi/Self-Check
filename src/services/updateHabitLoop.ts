import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"

// This function checks whether a calendar day has passed
// Used for reseting the streak / setting the completion to false on a new day

export const updateHabitLoop = async (id: number) => {
    const [row] = await db.select().from(habit).where(eq(habit.id, id))
    const difference = timeDifference(row.lastCompleted);
    console.log(`Days passed: ${difference}`)
    if (difference >= 1) {
        await db.update(habit).set({ completed: false, prevLastCompletion: row.lastCompleted }).where(eq(habit.id, id))
    }
    if (difference >= 2) {
        const date = new Date()
        await db.update(habit).set({ streak: 0, lastCompleted: date, prevLastCompletion: date }).where(eq(habit.id, id))
    }
    if (difference >= 1) return "update";
    else return;
}

const timeDifference = (lastCompleted: Date) => {
    const getDate = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const daysBetween = Math.round((getDate(new Date()).getTime() - getDate(lastCompleted).getTime()) / 864e5)
    return daysBetween
}
