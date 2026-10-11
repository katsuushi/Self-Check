import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
export default function Tasks() {


    return (
        <View className="flex justify-center align-center" style={styles.body}>
           <Text className="text-white font-bold text-center">This is tasks</Text> 
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

