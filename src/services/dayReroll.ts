import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { Result } from "@/types"
import { resetLoop, resetStreak, timeDifference } from "@/helperfn"

// This function checks whether a calendar day has passed
// Used for reseting the streak / setting the completion to false on a new day

export const updateHabitLoop = async (id: number): Promise<Result> => {
    if (!id) return { success: false, error: "No id has been passed." }

    const [row] = await db.select().from(habit).where(eq(habit.id, id))
    if (!row) return { success: false, error: "Could not find a habit matching the id" }

    const difference = timeDifference(row.latestMark);
    if (Number.isNaN(difference)) {
        return { success: false, error: "row.latestMark is not a valid date." }
    }
    if (difference === 1) {
        await resetLoop(id, row)
    } else if (difference >= 2) {
        await resetStreak(id, row)
    }
    if (difference >= 1) return { success: true, data: "true" };
    else return { success: true, data: "false" };
}
