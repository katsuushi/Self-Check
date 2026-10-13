import { Stack } from "expo-router";
import { Text, View } from "react-native"
import "../../global.css"
import Logo from "./components/Logo"
import NavigationBar from "./components/NavigationBar"


import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { db } from "../db/client"
import migrations from "../../drizzle/migrations"

export default function RootLayout() {

    const { success, error } = useMigrations(db, migrations);

    if (error) {
        return <View><Text>Migration error: {error.message}</Text></View>
    }
    if (!success) {
        return <View><Text>Migrating...</Text></View>
    }

    return <>
        <Logo />
        <Stack screenOptions={{
            headerShown: false
        }} />
        <NavigationBar />

    </>
}
