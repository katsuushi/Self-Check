import { useEffect, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const useFirstLaunch = () => {
    const [isFirstLaunch, setIsFirstLaunch] = useState<boolean | null>(null);

    const KEY = "hasLaunchedBefore"

    useEffect(() => {
        (async () => {
            try {
                const res = await AsyncStorage.getItem(KEY);
                if (res === null) {
                    setIsFirstLaunch(true)
                    await AsyncStorage.setItem(KEY, 'true')
                } else {
                    setIsFirstLaunch(false);
                }
            } catch {
                setIsFirstLaunch(false)
            }
        })();
    }, [])

    return isFirstLaunch;

}
