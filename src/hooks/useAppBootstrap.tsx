import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { db } from "../db/client"
import migrations from "../../drizzle/migrations"
import { dayReroll } from "@/services/dayReroll";
import { useState, useEffect } from "react"
export default function useAppBootStrap() {

    const { success, error: migrationError } = useMigrations(db, migrations);
    const [reroll, setReroll] = useState(false)
    const [rerollError, setRerollError] = useState<string | null>(null)

    const calendarReroll = async (cancelled: boolean) => {
        const res = await dayReroll()
        if (cancelled) return;
        if (res.success) return setReroll(true);
        else setRerollError(res.error ?? "DayReroll failed");
    }

    useEffect(() => {
        if (!success) return;

        let cancelled = false;

        calendarReroll(cancelled)

        return () => {
            cancelled = true;
        }

    }, [success])


    return {
        ready: success && reroll,
        error: migrationError?.message ?? rerollError
    }

}
