import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"

export const habit = sqliteTable("habit", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description").notNull(),
    color: integer("color", {mode: 'number'}).notNull(),
    completed: integer("done", { mode: 'boolean' }).notNull().default(false),
    lastCompleted: integer("lastCompleted", { mode: 'timestamp' })
})
