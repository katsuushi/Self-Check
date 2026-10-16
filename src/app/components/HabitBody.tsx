import { Pressable, View, Text } from "react-native";
import { useEffect, useState } from "react"
import { deleteHabit } from "@/services/deleteHabit";
import { updateHabitData } from "@/services/updateHabitData"
import { updateHabitLoop } from "@/services/updateHabitLoop";

type HabitBodyProps = {
    id: number;
    title: string;
    color: string;
    description?: string | null;
    completed: boolean;
    streak: number;
    updateUI: () => void;
};

export default function HabitBody({
    id,
    title,
    color,
    description,
    completed,
    streak,
    updateUI
}: HabitBodyProps) {

    const [isCompleted, setIsCompleted] = useState(completed);
    const [currentStreak, setCurrentStreak] = useState(streak)

    useEffect(() => {
        calendarLoop()
    }, [])

    const calendarLoop = async () => {
        const res = await updateHabitLoop(id);
        if (res == "update") {
            setIsCompleted(false)
        }
    }

    const onMark = () => {
        // onMark - marking habit as completed / not completed
        setCurrentStreak(isCompleted ? currentStreak - 1 : currentStreak + 1)
        setIsCompleted(!isCompleted)
        updateHabitData(id)
    }

    const onDelete = async () => {
        await deleteHabit(id);
        updateUI();
    }

    return (
        <View className="flex-row items-center justify-between gap-3 rounded-xl bg-black p-4 border-l-4" style={{ borderLeftColor: color }}>
            <View className="flex-row gap-x-4 min-w-0">
                <Text className="text-2xl font-semibold text-white text-center truncate">{title}</Text>

                <Text className="text-2xl font-semibold text-white truncate">{currentStreak}</Text>
            </View>
            <View className="flex-row items-center gap-2">
                <Pressable
                    onPress={onMark}
                    style={!isCompleted ? { borderColor: color } : undefined}
                    className={`w-10 h-10 rounded-full border-white flex items-center justify-center ${isCompleted ? "bg-cyan-400 border-cyan-400" : ``
                        }`}
                    accessibilityLabel={isCompleted ? "Mark incomplete" : "Mark complete"}
                >
                    <View pointerEvents="none">
                        <Text className="text-white text-xl font-bold">✓</Text>
                    </View>
                </Pressable>
                <Pressable onPress={() => console.log("Onedit")} className="w-10 rounded-full h-10 items-center justify-center active:bg-white/10" accessibilityLabel="Edit habit">
                    <Text className="text-white/70 text-2xl ">✎</Text>
                </Pressable>
                <Pressable onPress={onDelete} className="w-10 h-10 rounded-full items-center justify-center active:bg-red-500/20" accessibilityLabel="Delete habit">
                    <Text className="text-white/50 text-2xl">...</Text>
                </Pressable>
            </View>
        </View>
    );
}
