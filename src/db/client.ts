import { drizzle } from "drizzle-orm/expo-sqlite"
import { openDatabaseSync, deleteDatabaseAsync } from "expo-sqlite"
import * as schema from './schema'

export const expo = openDatabaseSync('app.db', { enableChangeListener: true })
export const db = drizzle(expo, { schema })
