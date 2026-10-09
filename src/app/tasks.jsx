import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
export default function Tasks() {


    return (
        <View style={styles.body}>
           <Text>This is tasks</Text> 
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

