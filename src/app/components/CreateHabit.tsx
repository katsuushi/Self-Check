import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

const COLORS = ["#22d3ee", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"];

export type HabitFormValues = {
    title: string;
    description: string;
    color: string;
};

type CreateHabitProps = {
    isEditing?: boolean;
    initialTitle?: string;
    initialDescription?: string;
    initialColor?: string;
    onClose: () => void;
    onSave: (values: HabitFormValues) => Promise<boolean> | boolean;
};

export default function CreateHabit({
    isEditing = false,
    initialTitle = "",
    initialDescription = "",
    initialColor = COLORS[0],
    onClose,
    onSave,
}: CreateHabitProps) {
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [color, setColor] = useState(initialColor);

    const canSave = title.trim().length > 0;

    const save = async () => {
        if (!canSave) return;
        const success = await onSave({ title, description, color });
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

                <Text className="text-xs text-white/50 font-bold uppercase mt-5 mb-1">
                    Habit Title
                </Text>
                <TextInput
                    value={title}
                    onChangeText={setTitle}
                    placeholder="e.g. Drink water"
                    placeholderTextColor="#6b7280"
                    className="rounded-xl bg-[#000] px-4 py-3 text-base text-white"
                />

                <Text className="text-xs text-white/50 font-bold uppercase mt-4 mb-1">
                    Description
                </Text>
                <TextInput
                    value={description}
                    onChangeText={setDescription}
                    placeholder="Why does this habit matter?"
                    placeholderTextColor="#6b7280"
                    multiline
                    textAlignVertical="top"
                    className="h-28 rounded-xl bg-[#000] px-4 py-3 text-base text-white"
                />

                <Text className="text-xs text-white/50 font-bold uppercase mt-4 mb-2">
                    Color
                </Text>
                <View className="flex-row flex-wrap gap-3">
                    {COLORS.map((c) => (
                        <Pressable
                            key={c}
                            onPress={() => setColor(c)}
                            style={{ backgroundColor: c }}
                            className={
                                color === c
                                    ? "h-9 w-9 rounded-full border-2 border-white"
                                    : "h-9 w-9 rounded-full border-2 border-transparent"
                            }
                        />
                    ))}
                </View>
            </View>
        </View>
    );
}
