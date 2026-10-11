import { View, Text, Pressable, StyleSheet } from "react-native"

export default function AddHabitPopup() {
    return (
        <View className="bg-[#000] w-[75vw] h-[75vh] rounded-3xl p-4 absolute top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%]">

            <Text style={styles.header}>Add Habit</Text>

        </View>
    )
}

const styles = StyleSheet.create({
    text: {
        color: "#eee",
    },
    header: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 24
    }
})
