import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { deleteHabit } from "@/services/deleteHabit";
import { updateHabit } from "@/services/updateHabit";
import CreateHabit, { type HabitFormValues } from "./components/CreateHabit";
import { getHabit } from "@/services/getHabit";
import type { HabitHistory } from "@/db/schema";

type HabitData = {
    title: string;
    description: string;
    color: string;
    habitHistory: HabitHistory;
};

type HabitOverviewParams = {
    id: string;
    title: string;
    color: string;
    description?: string;
    completed: string;
    streak: string;
    createdAt: string;
};

export default function HabitOverview() {
    const router = useRouter();

    const { id, title, color, description, streak, createdAt } = useLocalSearchParams<HabitOverviewParams>();

    const [optionsActive, setOptionsActive] = useState(false)
    const [editingHabit, setEditingHabit] = useState(false)
    const [habitData, setHabitData] = useState<HabitData>({
        title: title ?? "",
        description: description ?? "",
        color: color ?? "#22d3ee",
        habitHistory: {},
    })

    const scrollRef = useRef<ScrollView>(null);

    const onUpdate = async ({ title, description, color }: HabitFormValues) => {
        const res = await updateHabit(Number(id), title, description, color);
        if (res.success) setHabitData((prev) => ({ ...prev, title, description, color }));
        return res.success;
    }

    const onDelete = async () => {
        const res = await deleteHabit(Number(id));
        if (res.success) router.replace("/habits");
    }

    const getHabitHistory = async (id: number) => {
        console.log("gettingHabitHistory")
        const habit = await getHabit(id);
        if (habit.success) setHabitData((prev) => ({ ...prev, habitHistory: habit.data.habitHistory }));
    }

    useEffect(() => {
        getHabitHistory(Number(id))
    }, [])

    return (<>
        <View className="flex-1 bg-[#000]">
            {/* Top bar */}

            <View className="w-full h-14 flex-row items-center justify-between px-4 bg-black">
                <Pressable
                    onPress={() => router.replace("/habits")}
                    className="w-10 h-10 rounded-full items-center justify-center active:bg-white/10"
                    accessibilityLabel="Go back"
                >
                    <Text className="text-white text-2xl font-bold">←</Text>
                </Pressable>
                <View className="flex flex-row justify-between gap-x-2 align-center">

                    <Pressable
                        onPress={() => {
                            setOptionsActive(false);
                            setEditingHabit(true);
                        }}
                        className="w-10 h-10 rounded-full items-center justify-center active:bg-white/10"
                        accessibilityLabel="Edit habit"
                    >
                        <Text className="text-white text-2xl font-bold">✎</Text>
                    </Pressable>


                    <Pressable
                        onPress={() => setOptionsActive(!optionsActive)}
                        className="w-10 h-10 rounded-full items-center justify-center active:bg-white/10"
                        accessibilityLabel="More options"
                    >
                        <Text className="text-white text-2xl font-bold">⋯</Text>
                    </Pressable>


                </View>
                {
                    optionsActive && (
                        <View className="bg-[#000] absolute w-32 h-16 right-2 top-2 flex justify-center align-center z-20">

                            <Pressable onPress={onDelete} className=" min-h-full active:bg-[#000] flex justify-center align-center">
                                <View pointerEvents="none">
                                    <Text className=" text-center text-white  text-xl">Delete habit</Text>
                                </View>

                            </Pressable>

                        </View>
                    )
                }
            </View>
            <View className="min-h-full">

                <ScrollView className="px-8 mt-4" contentContainerStyle={{ paddingBottom: 32 }}>

                    {/* Title and description */}
                    <Text className="text-4xl font-bold text-white mt-2">{habitData.title}</Text>

                    <Text className="text-xl mt-2" style={{ color: habitData.color }}>
                        {habitData.description}
                    </Text>

                    {/* Current streak */}
                    <Text className="text-xl font-bold text-white mt-8">
                        Current Streak: {streak}
                    </Text>

                    {/* Divider - placeholder for future content */}
                    <View className="h-px bg-white/10 my-8" />

                    <Text className="text-white text-2xl font-bold mb-4">Completion Log</Text>
                    <ScrollView
                        className="border-2 border-white h-40 grid grid-rows-7 grid-flow-col"
                        ref={scrollRef}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
                    >


                    </ScrollView>
                </ScrollView>


            </View>
            {optionsActive && <Pressable onPress={() => setOptionsActive(false)} className="absolute inset-0 z-10"></Pressable>}

            {editingHabit && (
                <CreateHabit
                    isEditing
                    initialTitle={habitData.title}
                    initialDescription={habitData.description}
                    initialColor={habitData.color}
                    onClose={() => setEditingHabit(false)}
                    onSave={onUpdate}
                />
            )}

        </View>

    </>
    );
}
