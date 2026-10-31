import { useRouter } from "expo-router"
import { Pressable, View, Text } from "react-native";
import { useEffect, useState } from "react"
import { deleteHabit } from "@/services/deleteHabit";
import { onMarkHabit } from "@/services/onMarkHabit"
import { updateHabitLoop } from "@/services/dayReroll";
import type { HabitBodyProps } from "@/types";
import { useFlagsStore } from "@/stores/habitData";

export default function HabitBody({
    id,
    title,
    color,
    description,
    completed,
    streak,
    bestStreak,
    createdAt,
    habitHistory,
    updateUI
}: HabitBodyProps) {

    const router = useRouter();

    useEffect(() => {
        calendarLoop()
    }, [])

    const calendarLoop = async () => {
        const res = await updateHabitLoop(id);
        if (res.success) {
            updateUI()
        } else if (!res.success) {
            // Error handling
        }
    }

    const onMark = async () => {
        // onMark - marking habit as completed / not completed
        console.log("calling onMark")
        const res = await onMarkHabit(id)
        console.log(res)
        if (res.success && typeof res.data === "object") {
            updateUI();
        } else if (!res.success) {
            //
        } else {
            // Something has gone wrong
        }
    }

    const onOverview = () => {
        useFlagsStore.getState().setFlags(habitHistory)
        router.push({
            pathname: '../habitoverview',
            params: {
                id: id,
                title: title,
                color: color,
                description: description,
                completed: String(completed),
                streak: streak,
                bestStreak: bestStreak,
                createdAt: createdAt.toISOString(),
                habitHistory: JSON.stringify(habitHistory)
            }
        })
    }


    return (
        <>
            <Pressable onPress={onOverview} className="z-50 absolute w-[75%] h-full "></Pressable>
            <View className="flex-row items-center justify-between gap-3 rounded-xl bg-black p-4 border-l-4" style={{ borderLeftColor: color }}>
                <View className="flex-row gap-x-4 min-w-0">
                    <Text className="text-2xl font-semibold text-white text-center truncate">{title}</Text>

                    <Text className="text-2xl font-semibold text-white truncate">{streak}</Text>
                </View>
                <View pointerEvents="auto" className="z-99 flex-row items-center gap-2">
                    <Pressable
                        onPress={onMark}
                        style={!completed ? { borderColor: color } : undefined}
                        className={`w-10 h-10 rounded-full border-white flex items-center justify-center ${completed ? "bg-cyan-400 border-cyan-400" : ``
                            }`}
                        accessibilityLabel={completed ? "Mark incomplete" : "Mark complete"}
                    >
                        <View pointerEvents="none">
                            <Text className="text-white text-xl font-bold">✓</Text>
                        </View>
                    </Pressable>
                    <Pressable onPress={onOverview} className="z-99 w-10 rounded-full h-10 items-center justify-center active:bg-white/10" accessibilityLabel="Edit habit">
                        <Text className="text-white/70 text-2xl ">...</Text>
                    </Pressable>
                </View>
            </View>
        </>
    );
}
