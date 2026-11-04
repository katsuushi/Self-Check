import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { Success } from "@/types"
import { resetLoop, resetStreak, timeDifference } from "@/helper/helperfn"

// This function checks whether a calendar day has passed
// Used for reseting the streak / setting the completion to false on a new day

export const dayReroll = async (): Promise<Success> => {
    try {
        await db.transaction(async (tx) => {
            const rows = await tx.select().from(habit)

            for (const row of rows) {

                const difference = timeDifference(row.latestMark);
                if (Number.isNaN(difference)) {
                    throw new Error("row.latestMark is most likely a invalid date.")
                }
                if (difference === 1) resetLoop(tx, row)
                else if (difference >= 2) resetStreak(tx, row)
            }
        })
    } catch (err) {
        return { success: false, error: "The dayReroll transaction failed." }
    }
    return { success: true };
}
