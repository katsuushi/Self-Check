import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import AddHabitBtn from './components/AddHabitBtn.jsx'
export default function Habits() {


    return (
        <View style={styles.body}>
            <AddHabitBtn />
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

