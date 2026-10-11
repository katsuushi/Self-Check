import { Stack } from "expo-router";
import "../../global.css"
import Logo from "./components/Logo"
import NavigationBar from "./components/NavigationBar"
export default function RootLayout() {
    return <>
        <Logo />
        <Stack screenOptions={{
            headerShown: false
        }} />
        <NavigationBar />

    </>
}
