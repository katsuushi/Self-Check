import { useLocalSearchParams, useRouter } from "expo-router";
import { Pressable, ScrollView, Text, View } from "react-native";

type HabitOverviewParams = {
    id: string;
    title: string;
    color: string;
    description?: string;
    completed: string;
    streak: string;
};

export default function HabitOverview() {
    const router = useRouter();

    const { title, color, description, streak } = useLocalSearchParams<HabitOverviewParams>();

    return (
        <View className="flex-1 bg-[#202020]">
            {/* Top bar */}
            <View className="w-full h-14 flex-row items-center justify-between px-4 bg-black">
                <Pressable
                    onPress={() => router.back()}
                    className="w-10 h-10 rounded-full items-center justify-center active:bg-white/10"
                    accessibilityLabel="Go back"
                >
                    <Text className="text-white text-2xl font-bold">←</Text>
                </Pressable>

                <Pressable
                    className="w-10 h-10 rounded-full items-center justify-center active:bg-white/10"
                    accessibilityLabel="More options"
                >
                    <Text className="text-white text-2xl font-bold">⋯</Text>
                </Pressable>
            </View>

            <ScrollView className="px-8 mt-4" contentContainerStyle={{ paddingBottom: 32 }}>
                {/* Title and description */}
                <Text className="text-4xl font-bold text-white mt-2">{title}</Text>

                <Text className="text-xl mt-2" style={{ color: color }}>
                    {description}
                </Text>

                {/* Current streak */}
                <Text className="text-xl font-bold text-white mt-8">
                    Current Streak: {streak}
                </Text>

                {/* Divider - placeholder for future content */}
                <View className="h-px bg-white/10 mt-8" />
            </ScrollView>
        </View>
    );
}
