import { useState } from "react";
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text, TextInput, View } from "react-native";
import type { DayStatus, MeasurableMarkMenuProps } from "@/types";

export default function MeasurableMarkMenu({
    title,
    targetGoal,
    initialAmount,
    onClose,
    onSubmit,
}: MeasurableMarkMenuProps) {
    const [measureValue, setMeasureValue] = useState(
        initialAmount !== undefined && Number.isFinite(initialAmount) && initialAmount > 0
            ? String(initialAmount)
            : ""
    );
    const [numErrorMessage, setNumErrorMessage] = useState(false)
    const [charErrorMessage, setCharErrorMessage] = useState(false)
    const trimmedMeasureValue = measureValue.trim();
    const parsedMeasureValue = Number(trimmedMeasureValue);
    const isMeasureValueValid =
        trimmedMeasureValue === "" || (Number.isFinite(parsedMeasureValue) && parsedMeasureValue > 0);

    const submit = async (value: DayStatus) => {
        if (value === 1 && !isMeasureValueValid) {
            setCharErrorMessage(true)
        }
        if (value === 1 && Number(measureValue) <= 0) {
            setNumErrorMessage(true);
            return;
        }
        setNumErrorMessage(false)
        setCharErrorMessage(false)
        const amount = value === 1 && trimmedMeasureValue !== ""
            ? parsedMeasureValue
            : undefined;
        await onSubmit(value, amount);
    };

    return (
        <Modal
            visible
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
            >
                <Pressable
                    className="absolute inset-0 bg-black/60"
                    onPress={onClose}
                />

                <View className="w-64 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
                    <Text className="text-center text-lg font-bold text-white">
                        {title}
                    </Text>
                    <Text className="mt-1 text-center text-xs text-white/50">
                        Target: {targetGoal}
                    </Text>

                    <TextInput
                        value={measureValue}
                        onChangeText={(text) =>
                            setMeasureValue(text.replace(/,/g, ".").replace(/[^0-9.]/g, ""))
                        }
                        keyboardType="decimal-pad"
                        placeholder="Value"
                        placeholderTextColor="#6b7280"
                        accessibilityLabel="Measurable value"
                        className="mt-3 rounded-lg border border-white/10 bg-black px-3 py-2 text-center text-lg font-semibold text-white"
                    />
                    {charErrorMessage && (
                        <Text className="mt-1 text-xs text-red-400">The number is invalid</Text>
                    )}

                    {numErrorMessage && (
                        <Text className="mt-1 text-xs text-red-400">You can't put numbers less or equal to 0.</Text>
                    )}

                    <View className="mt-4 flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                            <Pressable
                                onPress={() => submit(2)}
                                className="h-11 w-11 items-center justify-center rounded-md active:bg-white/20"
                                accessibilityRole="button"
                                accessibilityLabel="Skip day"
                            >
                                <Text className="text-2xl font-bold text-white">—</Text>
                            </Pressable>

                            <Pressable
                                onPress={() => submit(0)}
                                className="h-11 w-11 items-center justify-center rounded-md active:bg-white/20"
                                accessibilityRole="button"
                                accessibilityLabel="Mark not completed"
                            >
                                <Text className="text-2xl font-bold text-white">✕</Text>
                            </Pressable>
                        </View>

                        <Pressable
                            onPress={() => submit(1)}
                            disabled={!isMeasureValueValid}
                            className={`ml-4 h-14 w-14 items-center justify-center rounded-md ${isMeasureValueValid ? "active:bg-white/20" : "opacity-40"}`}
                            accessibilityRole="button"
                            accessibilityLabel="Mark completed"
                        >
                            <Text className="text-3xl font-bold text-white">→</Text>
                        </Pressable>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </Modal>
    );
}
