import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { deleteHabit } from "@/services/deleteHabit";
import { updateHabit } from "@/services/editHabit";
import CreateHabit from "./components/CreateHabit";
import { getHabit } from "@/services/getHabit";
import type {
    HabitData,
    HabitFormValues,
    HabitOverviewParams,
} from "@/types";
import CalendarCell, {
    CALENDAR_CELL_SIZE,
    CALENDAR_GAP,
    CALENDAR_HEIGHT,
} from "./components/CalendarCell";
import { editPastDay } from "@/services/editPastDay";
import { useFlagsStore } from "@/stores/habitData";

export default function HabitOverview() {
    const router = useRouter();

    const { id, title, color, description, completed, streak, bestStreak, createdAt } = useLocalSearchParams<HabitOverviewParams>();

    const [optionsActive, setOptionsActive] = useState(false)
    const [editingHabit, setEditingHabit] = useState(false)
    const [habitData, setHabitData] = useState<HabitData>({
        title: title ?? "",
        description: description ?? "",
        color: color ?? "#22d3ee",
        habitHistory: useFlagsStore((s) => s.flags),
        streak: Number(streak) || 0,
        bestStreak: Number(bestStreak) || 0,
        createdAt: createdAt ? new Date(createdAt) : new Date(),
    })
    const [cellDates, setCellDates] = useState<string[]>([])
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
        console.log(habit)
        if (habit.success) {
            setHabitData((prev) => ({
                ...prev,
                habitHistory: habit.data.habitHistory,
                streak: habit.data.streak,
                createdAt: habit.data.createdAt,
            }));
        }
    }

    const isoDateRange = (start = new Date("2026-07-20"), end = new Date()) => {
        const out: string[] = [];
        const d = new Date(Date.UTC(start.getFullYear(), start.getMonth(), start.getDate()));
        const last = new Date(Date.UTC(end.getFullYear(), end.getMonth(), end.getDate()));

        while (d <= last) {
            out.push(d.toISOString().slice(0, 10));
            d.setUTCDate(d.getUTCDate() + 1);
        }
        return out
    }


    useEffect(() => {
        setCellDates(isoDateRange())
    }, [])

    const updateCells = async (date: string, value: boolean) => {
        const res = await editPastDay(Number(id), date, value)
        if (res.success) {
            setHabitData((prev) => ({
                ...prev,
                habitHistory: res.data.newHistory,
                streak: res.data.newStreak,
                bestStreak: res.data.newBestStreak
            }))
        }
        else if (!res.success) {
            console.log(res.error)
        } else {
            console.log("Something went wrong")
        }
    }

    const createdOn = Number.isNaN(habitData.createdAt.getTime())
        ? "—"
        : habitData.createdAt.toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
        });
    return (<>
        <View className="flex-1 bg-[#000]">

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

                    <Text className="text-4xl font-bold text-white mt-2">{habitData.title}</Text>

                    <Text className="text-xl mt-2" style={{ color: habitData.color }}>
                        {habitData.description}
                    </Text>

                    <View className="flex-row justify-evenly items-center mt-8">
                        <View className="flex-1 items-center">
                            <View className="flex-row items-center gap-x-2">
                                <Image
                                    source={require("../../assets/images/fire.png")}
                                    style={{ width: 24, height: 24 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-2xl font-bold text-white">
                                    {habitData.streak}
                                </Text>
                            </View>
                            <Text className="text-xs text-white/60 mt-1">
                                Current Streak
                            </Text>
                        </View>

                        <View className="flex-1 items-center">
                            <View className="flex-row items-center gap-x-2">
                                <Image
                                    source={require("../../assets/images/medal.png")}
                                    style={{ width: 24, height: 24 }}
                                    resizeMode="contain"
                                />
                                <Text className="text-2xl font-bold text-white">
                                    {habitData.bestStreak}
                                </Text>
                            </View>
                            <Text className="text-xs text-white/60 mt-1">
                                Best Streak
                            </Text>
                        </View>

                        <View className="flex-1 items-center h-full">
                            <View className="flex-row items-center gap-x-2">
                                <Image
                                    source={require("../../assets/images/calendar.png")}
                                    style={{ width: 28, height: 28 }}
                                    resizeMode="contain"
                                />
                                <Text
                                    className="text-xs font-bold text-white"
                                    numberOfLines={1}
                                >
                                    {createdOn}
                                </Text>
                            </View>
                            <Text className="text-xs text-white/60 mt-1">
                                Created
                            </Text>
                        </View>
                    </View>

                    <View className="h-px bg-white/10 my-8" />

                    <Text className="text-white text-2xl font-bold mb-4">Completion Log</Text>
                    <ScrollView
                        className="border-white"
                        style={{ height: CALENDAR_HEIGHT + 16 }}
                        contentContainerStyle={{ padding: 0 }}
                        ref={scrollRef}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
                    >
                        <View className="min-w-[100%] ml-auto h-full border-2 items-end flex-wrap" style={{ flexDirection: "column", gap: CALENDAR_GAP }}>


                            {cellDates.map((d, i) => (
                                <View
                                    key={i}
                                    style={{ flexDirection: "column", gap: CALENDAR_GAP }}
                                >
                                    <CalendarCell
                                        key={i}
                                        date={d}
                                        completed={d in habitData.habitHistory && habitData.habitHistory[d]}
                                        onEditCell={updateCells}
                                    />
                                </View>
                            ))}
                        </View>
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
