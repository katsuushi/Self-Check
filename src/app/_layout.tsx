import { SplashScreen, Stack } from "expo-router";
import { Text, View } from "react-native"
import { useEffect } from "react"
import "../../global.css"
import Logo from "./components/Logo"
import FirstTimePopup from "./components/FirstTimePopup"

import * as SystemUI from 'expo-system-ui'
import useAppBootStrap from "../hooks/useAppBootstrap";
import { useFirstLaunch } from "@/hooks/useFirstLaunch";

export default function RootLayout() {
    const { ready, error } = useAppBootStrap()
    const { isFirstLaunch, markLaunched } = useFirstLaunch()

    useEffect(() => {
        SystemUI.setBackgroundColorAsync('#000000').catch(() => {
            return;
        })
    }, [])

    useEffect(() => {
        if (ready) SplashScreen.hideAsync();
    }, [ready]);


    if (error) {
        SplashScreen.hideAsync();
        return <View><Text>Error during useAppBootstrap: {error}</Text></View>;
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
            {isFirstLaunch && (
                <FirstTimePopup onClose={markLaunched} />
            )}
        </>
    );
}
