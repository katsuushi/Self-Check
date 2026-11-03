import { db } from "../db/client"
import { habit } from "@/db/schema"
import { eq } from "drizzle-orm"
import type { DayStatus, ReturnFromEditDay } from "@/types"
import { applyHistoryValue, calculateNewStreak, localISODate } from "@/helperfn"

export const editPastDay = async (id: number, date: string, value: DayStatus, amount?: number): Promise<ReturnFromEditDay> => {

    if (!id || !date) return { success: false, error: "Id / Date value hasn't be put or is invalid" }
    if (value !== 0 && value !== 1 && value !== 2) return { success: false, error: "The value parameter is invalid." }
    const [row] = await db.select().from(habit).where(eq(habit.id, id));
    if (!row) return { success: false, error: "No habit found with the requested id." }
    if (row.habitType === "measurable" && !amount && value === 1) return { success: false, error: "Habit is measurable, but the amount is invalid." }

    const amountToStore =
        row.habitType === "measurable" &&
            value === 1 &&
            amount !== undefined &&
            Number.isFinite(amount) &&
            amount > 0
            ? amount
            : undefined;
    const newHistory = applyHistoryValue(row.habitHistory, value, amountToStore, date);
    const today = localISODate()
    let newCompleted = false;
    if (date === today && value === 1) {
        if (!amount) {
            newCompleted = true;
        } else if (amount >= row.targetGoal) {
            newCompleted = true;
        }
    }
    const latestMarkDate = Object.keys(newHistory).sort().at(-1)
    let newLatestMark: Date;
    if (latestMarkDate) {
        const [year, month, day] = latestMarkDate.split("-").map(Number);
        newLatestMark = new Date(year, month - 1, day, 12)
    } else {
        newLatestMark = row.prevLatestMark
    }

    const newStreaks = calculateNewStreak(newHistory, row.createdAt.toISOString(), (row.habitType === "measurable" && row.targetGoal))

    await db.update(habit).set({ completed: newCompleted, latestMark: newLatestMark, streak: newStreaks.newStreak, bestStreak: newStreaks.newBestStreak, habitHistory: newHistory }).where(eq(habit.id, id))
    console.log(`newStreak: ${newStreaks.newStreak}`)

    return { success: true, data: { newStreak: newStreaks.newStreak, newBestStreak: newStreaks.newBestStreak, newHistory: newHistory } }
}
