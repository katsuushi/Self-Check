import { SplashScreen, Stack } from "expo-router";
import { Text, View } from "react-native"
import { useEffect } from "react"
import "../../global.css"
import Logo from "./components/Logo"
import NavigationBar from "./components/NavigationBar"

import * as SystemUI from 'expo-system-ui'
import useAppBootStrap from "../hooks/useAppBootstrap";



export default function RootLayout() {
    const { ready, error } = useAppBootStrap()

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
        </>
        // soon <NavigationBar></NavigationBar>

    );
}
