import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"

export type HabitHistory = Record<string, boolean>;

export const habit = sqliteTable("habit", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
    color: text("color").notNull(),
    completed: integer("done", { mode: 'boolean' }).notNull().default(false),
    lastCompleted: integer("lastCompleted", { mode: 'timestamp' }).notNull(),
    prevLastCompletion: integer({ mode: 'timestamp' }).notNull(),
    streak: integer({ mode: 'number' }).default(0).notNull(),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    habitHistory: text({ mode: "json" })
        .$type<HabitHistory>()
        .notNull()
        .default(sql`'{}'`),
})
