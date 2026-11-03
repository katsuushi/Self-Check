import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import ColorPicker, { DEFAULT_COLOR } from "./ColorPicker";
import HabitTypeSelect, { DEFAULT_HABIT_TYPE } from "./HabitTypeSelect";
import type { CreateHabitProps, HabitType } from "@/types";

export default function CreateHabit({
    isEditing = false,
    initialTitle = "",
    initialDescription = "",
    initialColor = DEFAULT_COLOR,
    initialType = DEFAULT_HABIT_TYPE,
    initialTarget = 0,
    onClose,
    onSave,
}: CreateHabitProps) {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [color, setColor] = useState(initialColor);
    const [habitType, setHabitType] = useState<HabitType>(
        initialType === "measurable" ? "measurable" : DEFAULT_HABIT_TYPE
    );
    const [target, setTarget] = useState(initialTarget ? String(initialTarget) : "");

    const canSave = title.trim().length > 0 && (habitType !== "measurable" || Number(target) !== 0);

    const save = async () => {
        if (!canSave) return;
        const targetGoal = Number(target) || 0;
        const success = await onSave({
            title,
            description,
            color,
            habitType,
            targetGoal,
        });
        if (success) onClose();
    };

    return (
        <View className="absolute inset-0 items-center justify-center">
            <Pressable className="absolute inset-0 bg-black/50" onPress={onClose} />

            <View className="w-[85vw] rounded-3xl bg-black p-4">
                <View className="h-10 flex-row items-center justify-between">
                    <Text className="text-4xl text-white font-bold">
                        {isEditing ? "Edit Habit" : "Add Habit"}
                    </Text>
                    <Pressable
                        disabled={!canSave}
                        onPress={save}
                        className="h-10 w-10 flex justify-center align-center rounded-md active:bg-white/20"
                    >
                        <Text
                            className={
                                canSave
                                    ? "text-4xl text-cyan-400 font-bold text-center"
                                    : "text-4xl text-white/30 font-bold text-center"
                            }
                        >
                            ✓
                        </Text>
                    </Pressable>
                </View>

                <View className="mt-5 flex-row gap-4">
                    <View className="flex-1">
                        <Text className="text-xs text-white/90 font-bold uppercase mb-2">
                            Habit Title
                        </Text>
                        <TextInput
                            value={title}
                            onChangeText={setTitle}
                            placeholder="e.g. Drink water"
                            placeholderTextColor="#6b7280"
                            className="h-14 rounded-xl bg-[#000] px-4 py-4 text-base text-white"
                        />
                    </View>

                    <View className="w-16">
                        <ColorPicker value={color} onChange={setColor} />
                    </View>
                </View>


                <Text className="text-xs text-white/90 font-bold uppercase mt-4 mb-2">
                    Description
                </Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="..."
                    placeholderTextColor="#6b7280"
                    multiline
                    textAlignVertical="top"
                    className="h-28 rounded-xl bg-[#000] px-4 py-3 text-base text-white"
                />


                <View className="mt-4 flex-row gap-4">
                    <View className="flex-1">
                        <HabitTypeSelect value={habitType} onChange={setHabitType} />
                    </View>

                    {habitType === "measurable" && (
                        <View className="w-24">
                            <Text className="text-xs text-white/90 font-bold uppercase mb-2">
                                Target
                            </Text>
                            <TextInput
                                value={target}
                                onChangeText={(text) =>
                                    setTarget(text.replace(/[^0-9.]/g, ""))
                                }
                                placeholder="25, 32"
                                placeholderTextColor="#6b7280"
                                keyboardType="decimal-pad"
                                className="h-14 rounded-xl bg-[#000] px-4 text-base text-white"
                            />
                        </View>
                    )}
                </View>
            </View>
        </View>
    );
}
