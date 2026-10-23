import { db } from "../db/client"
import { habit } from "@/db/schema"
import { normalizeHabitHistory } from "@/db/history"
import { eq } from "drizzle-orm"
import { Result } from "./types/types"

export const updateHabitData = async (id: number): Promise<Result> => {
    if (!id) return { success: false, error: "No id has been passed." }
    let newStreak: number;
    let newLastCompleted: Date;
    const currentDate = new Date();
    const isoDate: string = localISODate();
    const [row] = await db.select().from(habit).where(eq(habit.id, id))
    if (!row) return { success: false, error: "Could not find the habit" }

    // Older builds stored history as an array. Convert it to the object map.
    const history = normalizeHabitHistory(row.habitHistory);

    if (row.completed) {
        newStreak = row.streak - 1
        newLastCompleted = row.prevLastCompletion
        delete history[isoDate]
    } else {
        newStreak = row.streak + 1
        newLastCompleted = currentDate
        history[isoDate] = true
    }
    await db.update(habit).set({ streak: newStreak, completed: !row.completed, lastCompleted: newLastCompleted, habitHistory: history }).where(eq(habit.id, id))

    return { success: true, data: { streak: newStreak, completed: !row.completed } }
}

export function localISODate(date = new Date()) {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}
