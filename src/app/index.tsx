import { Text, View, StyleSheet, useWindowDimensions } from "react-native";

export default function Index() {

    const { width, height } = useWindowDimensions();

    return (
        <View style={styles.body}>
            <View style={[styles.header, { height: height * 0.15 }]}>
                <Text style={styles.text}>Nah I'm him :D</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    body: {
        backgroundColor: "#303030",
        width: '100%',
        height: '100%',
    },
    header: {
        backgroundColor: '#000',
    },
    text: {
        color: "#fff",
        fontFamily: "Roboto", // doesnt work lmao
        fontSize: 16,
    }
});
