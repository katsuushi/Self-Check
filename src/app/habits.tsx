import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
export default function Habits() {


    return (
        <View style={styles.body}>
            <Text>This is habits</Text>

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

