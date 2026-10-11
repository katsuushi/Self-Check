import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import AddHabitBtn from './components/AddHabitBtn'
import AddHabitPopup from "./components/AddHabitPopup";
import { useState } from "react";
export default function Habits() {

    const [toggleAddHabitComponent, setToggleAddHabitComponent] = useState(false);

    return (
        <View style={styles.body}>
            <AddHabitBtn toggle={() => setToggleAddHabitComponent(!toggleAddHabitComponent)} />
            {toggleAddHabitComponent && <AddHabitPopup />}

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

