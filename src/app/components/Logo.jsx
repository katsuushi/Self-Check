import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
import { getStyles } from "../styles/styles.jsx";
export default function Logo() {
    const { width, height } = useWindowDimensions();
    const styles = getStyles();

    return (
        <>
            <View style={[styles.header, { height: height * 0.125 }]}>
                <Text className="text-3xl text-white">SelfCheck</Text>
            </View>
        </>
    );
}
