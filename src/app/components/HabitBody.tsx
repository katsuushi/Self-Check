import { useRouter } from "expo-router"
import { Pressable, Text, View } from "react-native";
import { useEffect, useState } from "react"
import MeasurableMarkMenu from "./MeasurableMarkMenu";
import { editPastDay } from "@/services/editPastDay";
import { onMarkHabit } from "@/services/onMarkHabit"
import { updateHabitLoop } from "@/services/dayReroll";
import { localISODate } from "@/helperfn";
import type { DayStatus, HabitBodyProps } from "@/types";
import { useFlagsStore } from "@/stores/habitData";

export default function HabitBody({
    id,
    title,
    color,
    description,
    completed,
    streak,
    bestStreak,
    habitType,
    targetGoal,
    createdAt,
    habitHistory,
    updateUI
}: HabitBodyProps) {

    const router = useRouter();
    const [markMenuOpen, setMarkMenuOpen] = useState(false);
    const todayHistoryValue = habitHistory[localISODate()];
    const initialMeasurableAmount = typeof todayHistoryValue === "number" && Number.isFinite(todayHistoryValue) && todayHistoryValue > 0
        ? todayHistoryValue
        : undefined;

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

    const openMeasurableMark = () => {
        setMarkMenuOpen(true);
    }

    const submitMeasurable = async (value: DayStatus, amount?: number) => {
        const res = await editPastDay(id, localISODate(), value, amount);
        if (res.success) {
            setMarkMenuOpen(false);
            updateUI();
        } else {
            console.log(res.error)
        }
    }

    const onMark = async () => {
        // onMark - opens the measurable menu or toggles a yes/no habit
        if (habitType === "measurable") {
            openMeasurableMark();
            return;
        }
        console.log("calling onMark")
        const res = await onMarkHabit(id, completed ? 0 : 1)
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
        console.log("clicking on ", title)
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
                habitType: habitType,
                targetGoal: String(targetGoal),
                createdAt: createdAt.toISOString(),
                habitHistory: JSON.stringify(habitHistory)
            }
        })
    }


    return (
        <>
            <Pressable onPress={onOverview} className="z-50 opacity-0 absolute w-[75%] h-full"></Pressable>
            <View className="flex-row items-center justify-between gap-3 rounded-xl bg-black p-4 border-l-4" style={{ borderLeftColor: color }}>
                <View className="flex-row gap-x-4 min-w-0 items-center">
                    <Text className="text-2xl font-semibold text-white text-center line-clamp-1 max-w-[55vw]">{title}</Text>

                    <Text className="text-2xl font-semibold text-white truncate text-center">{streak}</Text>
                </View>
                <View pointerEvents="auto" className="z-99 flex-row items-center gap-2">
                    <Pressable
                        onPress={onMark}
                        style={!completed ? { borderColor: color } : undefined}
                        className={`w-10 h-10 rounded-full border-white flex items-center justify-center ${completed ? "bg-cyan-400 border-cyan-400" : ``
                            }`}
                        accessibilityLabel={
                            habitType === "measurable"
                                ? "Open measurable mark menu"
                                : completed
                                    ? "Mark incomplete"
                                    : "Mark complete"
                        }
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

            {markMenuOpen && (
                <MeasurableMarkMenu
                    title={title}
                    targetGoal={targetGoal}
                    initialAmount={initialMeasurableAmount}
                    onClose={() => setMarkMenuOpen(false)}
                    onSubmit={submitMeasurable}
                />
            )}
        </>
    );
}
