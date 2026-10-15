import { View, StyleSheet } from "react-native";
import AddHabit from './components/AddHabit'
import HabitDisplay from "./components/HabitDisplay";

import { useState } from "react";

export default function Habits() {

    // Bumping this number tells HabitDisplay to refetch its habits.
    const [refreshKey, setRefreshKey] = useState(0);

    const refetchHabits = () => setRefreshKey(key => key + 1);

    return (
        <View style={styles.body}>
            <HabitDisplay refreshKey={refreshKey} updateUI={refetchHabits} />
            <AddHabit updateUI={refetchHabits} />
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
