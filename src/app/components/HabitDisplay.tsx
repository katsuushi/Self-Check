import { listHabits } from "@/services/listHabits";
import { useEffect, useState } from "react";
import { ScrollView } from "react-native";
import HabitBody from "./HabitBody";


type Habit = {
    id: number;
    title: string;
    description: string | null;
    color: string;
    completed: boolean;
    lastCompleted: Date | null;
}

export default function HabitDisplay() {

    const [habits, setHabits] = useState<Habit[]>([])

    const getHabits = () => {
        listHabits().then(rows => {
            console.log(rows)
            setHabits(rows)
        })
    }

    useEffect(() => {
        getHabits()
    }, [])

    return (
        <ScrollView className="p-4" contentContainerStyle={{ gap: 12 }}>
            {habits.map(habit => (
                <HabitBody
                    key={habit.id}
                    title={habit.title}
                    description={habit.description ?? undefined}
                    color={habit.color}
                    completed={habit.completed}
                />
            ))}
        </ScrollView>
    )
}
