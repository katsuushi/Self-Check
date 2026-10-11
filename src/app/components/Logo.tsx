import { Text, View, StyleSheet, useWindowDimensions } from "react-native";
export default function Logo() {
    const { width, height } = useWindowDimensions();

    return (
        <View className="bg-black h-[12vh]">
            <Text className="text-4xl text-white font-bold mt-auto p-4">SelfCheck</Text>
        </View>
    );
}
