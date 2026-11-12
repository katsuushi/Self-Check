import { drizzle } from "drizzle-orm/expo-sqlite"
import { openDatabaseSync } from "expo-sqlite"
import * as schema from './schema'
export type HabitTx = Parameters<Parameters<typeof db.transaction>[0]>[0];
export const expo = openDatabaseSync('app.db', { enableChangeListener: true })
export const db = drizzle(expo, { schema })
