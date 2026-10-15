import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

type Value = number | string

export const habit = sqliteTable("habit", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
    color: text("color").notNull(),
    completed: integer("done", { mode: 'boolean' }).notNull().default(false),
    lastCompleted: integer("lastCompleted", { mode: 'timestamp' }),
    prevLastCompletion: integer({ mode: 'timestamp' }),
    streak: integer({ mode: 'number' }).default(0).notNull(),
    streakHistory: text({ mode: "json" })
        .$type<Record<string, Value>[]>()
        .notNull()
        .default([]),
})
