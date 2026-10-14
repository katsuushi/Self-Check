import { View, StyleSheet } from "react-native";
import AddHabit from './components/AddHabit'
import HabitDisplay from "./components/HabitDisplay";

import { useState } from "react";

export default function Habits() {
    
    return (
        <View style={styles.body}>
            <HabitDisplay />
            <AddHabit/>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#202020",
        width: "100%",
        height: "100%",
    }
})
