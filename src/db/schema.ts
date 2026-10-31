import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm"
import type { HabitHistory } from "@/types";

export const habit = sqliteTable("habit", {
    id: integer({ mode: 'number' }).primaryKey({ autoIncrement: true }),
    title: text("title").notNull(),
    description: text("description"),
    color: text("color").notNull(),
    completed: integer("done", { mode: 'boolean' }).notNull().default(false),
    latestMark: integer("latestMark", { mode: 'timestamp' }).notNull(),
    prevLatestMark: integer({ mode: 'timestamp' }).notNull(),
    streak: integer({ mode: 'number' }).default(0).notNull(),
    bestStreak: integer({mode: 'number'}).default(0).notNull(),
    createdAt: integer({ mode: 'timestamp' }).notNull(),
    habitHistory: text({ mode: "json" })
        .$type<HabitHistory>()
        .notNull()
        .default(sql`'{}'`),
})
