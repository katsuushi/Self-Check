import { listHabits } from "@/services/listHabits";
import { useCallback, useEffect, useRef, useState } from "react";
import { ScrollView } from "react-native";
import HabitBody from "./HabitBody";
import { useFocusEffect } from "expo-router";


type Habit = {
    id: number;
    title: string;
    description: string | null;
    color: string;
    completed: boolean;
    streak: number;
    lastCompleted: Date | null;
}

type HabitDisplayProps = {
    refreshKey: number;
    updateUI: () => void;
}

export default function HabitDisplay(props: HabitDisplayProps) {

    const [habits, setHabits] = useState<Habit[]>([])
    const isFirstRender = useRef(true)
    const getHabits = async () => {
        const res = await listHabits()
        console.log(res)
        if (res) { setHabits(res) }

    }

    const incrementRefreshKey = () => {
        props.updateUI()
    }

    useFocusEffect(
        useCallback(() => {
            getHabits()
        }, [])
    )

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        getHabits()
    }, [props.refreshKey])

    return (
        <ScrollView className="p-4" contentContainerStyle={{ gap: 12 }}>
            {habits.map(habit => (
                <HabitBody
                    key={habit.id}
                    id={habit.id}
                    title={habit.title}
                    description={habit.description ?? undefined}
                    color={habit.color}
                    completed={habit.completed}
                    streak={habit.streak}
                    updateUI={incrementRefreshKey}
                />
            ))}
        </ScrollView>
    )
}
