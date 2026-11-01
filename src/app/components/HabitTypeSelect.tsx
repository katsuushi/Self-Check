import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import type { HabitType, HabitTypeSelectProps } from "@/types";

export const DEFAULT_HABIT_TYPE: HabitType = "yesNo";

const OPTIONS: { label: string; value: HabitType; description: string }[] = [
    {
        label: "Yes/No",
        value: "yesNo",
        description:
            "You can only mark the habit as completed/not completed.",
    },
    {
        label: "Measurable",
        value: "measurable",
        description:
            `You input a target value and the amount you've done each day, e.g. target is 10 pages/day, each day you input the number of pages you read. Habit is marked as "completed" when the input is equal or greater to the target value.`,
    },
];

export default function HabitTypeSelect({
    value,
    onChange,
    label = "Type",
}: HabitTypeSelectProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const selectedLabel =
        OPTIONS.find((option) => option.value === value)?.label ?? "Yes/No";

    const selectType = (nextValue: HabitType) => {
        onChange(nextValue);
        setMenuOpen(false);
    };

    return (
        <>
            <Text className="text-xs text-white/90 font-bold uppercase mb-2">
                {label}
            </Text>
            <Pressable
                onPress={() => setMenuOpen(true)}
                className="h-14 flex-row items-center justify-between rounded-xl bg-[#000] px-4 active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel={`${label}: ${selectedLabel}`}
                accessibilityHint="Opens habit type options"
            >
                <Text className="text-base text-white">{selectedLabel}</Text>
                <Text className="text-lg text-white/50">▾</Text>
            </Pressable>

            {menuOpen && (
                <Modal
                    visible
                    transparent
                    animationType="fade"
                    onRequestClose={() => setMenuOpen(false)}
                >
                    <View className="flex-1 items-center justify-center">
                        <Pressable
                            className="absolute inset-0 bg-black/60"
                            onPress={() => setMenuOpen(false)}
                        />

                        <View className="w-[85vw] max-w-md rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
                            <Text className="text-center text-lg font-bold text-white">
                                Habit Type
                            </Text>

                            <View className="mt-4 gap-2">
                                {OPTIONS.map((option) => {
                                    const selected = option.value === value;

                                    return (
                                        <Pressable
                                            key={option.value}
                                            onPress={() => selectType(option.value)}
                                            className={`rounded-xl px-4 py-3 active:bg-white/10 ${selected ? "bg-white/10" : ""
                                                }`}
                                            accessibilityRole="button"
                                            accessibilityLabel={`${option.label}. ${option.description}`}
                                        >
                                            <Text className="text-base text-white">
                                                {option.label}
                                            </Text>
                                            <Text className="mt-1 text-sm leading-5 text-slate-400">
                                                {option.description}
                                            </Text>
                                        </Pressable>
                                    );
                                })}
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
}
