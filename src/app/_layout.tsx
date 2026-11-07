import { SplashScreen, Stack } from "expo-router";
import { Text, View } from "react-native"
import { useEffect, useState } from "react"
import "../../global.css"
import Logo from "./components/Logo"
import NavigationBar from "./components/NavigationBar"
import FirstTimePopup from "./components/FirstTimePopup"

import * as SystemUI from 'expo-system-ui'
import useAppBootStrap from "../hooks/useAppBootstrap";
import { useFirstLaunch } from "@/hooks/useFirstLaunch";



export default function RootLayout() {
    const { ready, error } = useAppBootStrap()
    const firstTime = useFirstLaunch()
    const [firstTimeDismissed, setFirstTimeDismissed] = useState(false)
    SystemUI.setBackgroundColorAsync('#000000');


    useEffect(() => {
        if (ready) SplashScreen.hideAsync();
    }, [ready]);
        

    if (error) {
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
            {firstTime && !firstTimeDismissed && (
                <FirstTimePopup onClose={() => setFirstTimeDismissed(true)} />
            )}
        </>
        // soon <NavigationBar></NavigationBar>

    );
}
