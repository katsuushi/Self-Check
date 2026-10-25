import type { HabitHistory } from "@/types";

// Converts legacy array-shaped history into the date -> boolean map.
// Can delete but its too much to click D, 2, Enter
export function normalizeHabitHistory(value: unknown): HabitHistory {
    if (Array.isArray(value)) {
        const entries = value.filter(
            (entry) => entry && typeof entry === "object" && typeof entry.date === "string"
        ) as { date: string; value: unknown }[];

        return Object.fromEntries(entries.map((entry) => [entry.date, Boolean(entry.value)]))
    }
    if (value && typeof value === "object") {
        return { ...(value as HabitHistory) }
    }
    return {}
}
