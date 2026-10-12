import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function NavigationBar() {
    return (
        <View className="bg-black h-[8vh] flex flex-row justify-evenly align-center">
            <View className="w-[33%] flex justify-center align-center">
                <Link href="/habits">
                    <Text className="text-white text-xl  font-bold text-center">
                        Habits
                    </Text>
                </Link>
            </View>
            <View className="flex justify-center align-center  w-[33%]">
                <Link href="/tasks">
                    <Text className="color-white text-xl font-bold text-center">
                        Tasks
                    </Text>
                </Link>
            </View>
        </View>
    );
}
