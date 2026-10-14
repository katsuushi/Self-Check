import { Pressable, View, Text } from "react-native";
import { useState } from "react"

type HabitBodyProps = {
    title: string;
    description?: string;
    color: string;
    completed: boolean;
};

export default function HabitBody({
    title,
    description,
    color,
    completed,
}: HabitBodyProps) {

    const onMark = () => {
        // onMark - marking habit as completed / not completed
        completed = !completed
        console.log("onMark call")
    }

    return (
        <View className="flex-row items-center justify-between gap-3 rounded-xl bg-black p-4 border-l-4" style={{ borderLeftColor: color }}>
            <View className="flex-1 min-w-0">
                <Text className="text-2xl font-semibold text-white truncate">{title}</Text>
            </View>
            <View className="flex-row items-center gap-2">
                <Pressable
                    onPress={onMark}
                    style={!completed ? { borderColor: color } : undefined}
                    className={`w-10 h-10 rounded-full border-white flex items-center justify-center active:bg-white/10 ${completed ? "bg-cyan-400 border-cyan-400" : ``
                        }`}
                    accessibilityLabel={completed ? "Mark incomplete" : "Mark complete"}
                >
                    <View pointerEvents="none">
                        <Text className="text-white text-xl font-bold">✓</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => console.log("Onedit")} className="w-10 rounded-full h-10 items-center justify-center active:bg-white/10" accessibilityLabel="Edit habit">
                    <Text className="text-white/70 text-2xl ">✎</Text>
                </Pressable>
                <Pressable onPress={() => console.log("onDelete")} className="w-10 h-10 rounded-full items-center justify-center active:bg-red-500/20" accessibilityLabel="Delete habit">
                    <Text className="text-white/50 text-2xl">...</Text>
                </Pressable>
            </View>
        </View>
    );
}
