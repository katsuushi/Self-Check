import { Stack } from "expo-router";
import { Text, View } from "react-native"
import "../../global.css"
import Logo from "./components/Logo"
import NavigationBar from "./components/NavigationBar"

import * as SystemUI from 'expo-system-ui'


import { useMigrations } from "drizzle-orm/expo-sqlite/migrator"
import { db } from "../db/client"
import migrations from "../../drizzle/migrations"

export default function RootLayout() {

    const { success, error } = useMigrations(db, migrations);

    SystemUI.setBackgroundColorAsync('#000000')


    if (error) {
        return <View><Text>Migration error: {error.message}</Text></View>
    }
    if (!success) {
        return <View><Text>Migrating...</Text></View>
    }

    return <>
        <Logo />
        <Stack screenOptions={{
            headerShown: false,
            animation: 'none',
        }} />
    </>
    // <NavigationBar /> - will be added back after finishing habits

}
