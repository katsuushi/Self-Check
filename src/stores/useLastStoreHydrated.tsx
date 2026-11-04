import { useEffect, useState } from "react";
import { useLastStore } from "./lastDay";


export const useLastStoreHydrated = () => {

    const [hydrated, setHydrated] = useState(useLastStore.persist.hasHydrated());

    useEffect(() => {
        const unsub = useLastStore.persist.onFinishHydration(() => setHydrated(true));
        setHydrated(useLastStore.persist.hasHydrated());
        return unsub;
    }, []);

    return hydrated;

}
