import { db } from "@/db/client"
import { habit } from "@/db/schema"
import type { Success } from "@/types"
import { resetLoop, resetStreak, timeDifference } from "@/helper/helperfn"

export const dayReroll = async (): Promise<Success> => {
    try {
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
    } catch {
        return { success: false, error: "The dayReroll transaction failed." }
    }
    return { success: true };
}
