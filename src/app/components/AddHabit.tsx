import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { createHabit } from "../../services/createHabit"

const COLORS = ["#22d3ee", "#34d399", "#fbbf24", "#f87171", "#a78bfa", "#f472b6"];

type AddHabitBtnProps = {
    toggle?: () => void;
    updateUI: () => void; // Makes the habitDisplay component refetch the habits
}

export default function AddHabit(props: AddHabitBtnProps) {
    const [visible, setVisible] = useState(false);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [color, setColor] = useState(COLORS[0]);

    const setOpen = (open: boolean) => {
        setVisible(open);
        props.toggle?.();
    };

    const close = () => {
        setOpen(false);
        setTitle("");
        setDescription("");
        setColor(COLORS[0]);
    };

    const addHabit = async (title: string, description: string, color: string) => {
        const res = await createHabit(title, description, color)
        if (res.success) {
            close();
            props.updateUI();
        } else if (res.error) {
            // Error handling
        } else {
            // Something went wrong
        }
    }

    if (!visible) {
        return (
            <Pressable
                onPress={() => setOpen(true)}
                className="absolute bottom-8 right-8 w-16 h-16 rounded-md bg-cyan-400 active:bg-cyan-500 flex justify-center align-center"
            >
                <View pointerEvents="none">
                    <Text
                        pointerEvents="box-none"
                        className="text-5xl text-white font-bold text-center"
                    >
                        +
                    </Text>
                </View>
            </Pressable>
        );
    }

    const canSave = title.trim().length > 0;

    return (
        <View className="absolute inset-0 items-center justify-center">
            <Pressable className="absolute inset-0 bg-black/50" onPress={close} />

            <View className="w-[85vw] rounded-3xl bg-black p-4">
                <View className="h-10 flex-row items-center justify-between">
                    <Text className="text-4xl text-white font-bold">Add Habit</Text>
                    <Pressable
                        disabled={!canSave}
                        onPress={() => addHabit(title, description, color)}
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
                    className="rounded-xl bg-[#202020] px-4 py-3 text-base text-white"
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
                    className="h-28 rounded-xl bg-[#202020] px-4 py-3 text-base text-white"
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
