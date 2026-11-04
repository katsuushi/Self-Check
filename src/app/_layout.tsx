import { SplashScreen, Stack } from "expo-router";
import { Text, View } from "react-native"
import { useEffect } from "react"
import "../../global.css"
import Logo from "./components/Logo"
import NavigationBar from "./components/NavigationBar"

import * as SystemUI from 'expo-system-ui'


import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { db } from "../db/client"
import migrations from "../../drizzle/migrations"
import { useLastStore } from "@/stores/lastDay";
import { useLastStoreHydrated } from "@/stores/useLastStoreHydrated";

export default function RootLayout() {
    const { success, error } = useMigrations(db, migrations);
    const hydrated = useLastStoreHydrated();

    useEffect(() => {
        SystemUI.setBackgroundColorAsync('#000000');
    }, []);

    const ready = success && hydrated;

    useEffect(() => {
        if (ready) SplashScreen.hideAsync();
    }, [ready]);

    if (error) {
        return <View><Text>Migration error: {error.message}</Text></View>;
    }
    if (!ready) return null;

    return (
        <>
            <Logo />
            <Stack
                screenOptions={{
                    headerShown: false,
                    animation: 'none',
                }}
            />
        </>
        // soon <NavigationBar></NavigationBar>

    );
}
