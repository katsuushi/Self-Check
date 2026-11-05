import { db } from "@/db/client"
import { habit } from "@/db/schema"
import type { Success } from "@/types"
import { resetLoop, resetStreak, timeDifference } from "@/helper/helperfn"

// This function checks whether a calendar day has passed
// Used for reseting the streak / setting the completion to false on a new day

export const dayReroll = async (): Promise<Success> => {
    try {
        // expo-sqlite transactions are synchronous.
        db.transaction((tx) => {
            const rows = tx.select().from(habit).all()

            for (const row of rows) {

                const difference = timeDifference(row.latestMark);
                if (Number.isNaN(difference)) {
                    tx.rollback()
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
