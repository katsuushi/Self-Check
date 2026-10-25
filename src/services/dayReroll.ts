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
    if (Number.isNaN(difference)) {
        return { success: false, error: "row.lastCompleted is not a valid date." }
    }
    if (difference === 1) {
        await resetLoop(id, row)
    } else if (difference >= 2) {
        await resetStreak(id, row)
    }
    if (difference >= 1) return { success: true, data: "true" };
    else return { success: true, data: "false" };
}

const timeDifference = (lastCompleted: Date): number => {
    if (Number.isNaN(lastCompleted.getTime())) return NaN;

    const localDay = (d: Date) =>
        Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());

    return Math.round((localDay(new Date()) - localDay(lastCompleted)) / 864e5);
};

const resetLoop = async (id: number, row: InferSelectModel<typeof habit>) => {
    await db.update(habit).set({ completed: false, prevLastCompletion: row.lastCompleted }).where(eq(habit.id, id))
}

const resetStreak = async (id: number, row: InferSelectModel<typeof habit>) => {
    // Missing history keys already mean "not completed", so there is no
    // history to write here. Keep lastCompleted as the real last completion.
    await db.update(habit).set({
        completed: false,
        streak: 0,
        prevLastCompletion: row.lastCompleted,
    }).where(eq(habit.id, id))
}
