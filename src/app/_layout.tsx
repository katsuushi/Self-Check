import { Stack } from "expo-router";
import "../../global.css";
import Logo from "./components/Logo.jsx"
export default function RootLayout() {
    return <>
        <Logo />

        <Stack screenOptions={{
            headerShown: false
        }} />;


    </>
}
