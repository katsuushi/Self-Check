import { db } from "../db/client"
import { habit } from "@/db/schema"

export const createHabit = async (title: string, description: string, color: string) => {
    console.log(`Trying to create a habit with: ${title} ${description} and ${color}`)

    const date = new Date()

    const res = await db.insert(habit).values({title: title, description: description, color: color, lastCompleted: date, prevLastCompletion: date})

} 
