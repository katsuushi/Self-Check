import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

const KEY = "hasLaunchedBefore"

export const useFirstLaunch = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    useEffect(() => {
        let cancelled = false;

        (async () => {
            try {
                const res = await AsyncStorage.getItem(KEY);
                if (!cancelled) setIsFirstLaunch(res === null);
            } catch {
                if (!cancelled) setIsFirstLaunch(false);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [])

    const markLaunched = () => {
        setIsFirstLaunch(false);
        AsyncStorage.setItem(KEY, "true").catch(() => false);
    }

    return { isFirstLaunch, markLaunched };

}
