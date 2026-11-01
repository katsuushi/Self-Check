import { useState } from "react";
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    Pressable,
    Text,
    TextInput,
    View,
} from "react-native";
import type { ColorPickerProps } from "@/types";

export const DEFAULT_COLOR = "#22d3ee";

const PRESET_COLORS = [
    DEFAULT_COLOR,
    "#34d399",
    "#2dd4bf",
    "#60a5fa",
    "#818cf8",
    "#a78bfa",
    "#e879f9",
    "#f472b6",
    "#f87171",
    "#fb923c",
    "#fbbf24",
    "#9ca3af",
    "#ffffff",
];

export default function ColorPicker({
    value,
    onChange,
    label = "Color",
}: ColorPickerProps) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [hexInput, setHexInput] = useState(value.toUpperCase());
    const [warning, setWarning] = useState(false)
    const normalizedHex = `#${hexInput.replace(/^#/, "").trim()}`;
    const hexIsValid = /^#[0-9A-Fa-f]{6}$/.test(normalizedHex);
    const showHexError = hexInput.length > 0 && !hexIsValid;

    const openMenu = () => {
        setHexInput(value.toUpperCase());
        setMenuOpen(true);
    };

    const closeMenu = () => {
        setHexInput(value.toUpperCase());
        setMenuOpen(false);
    };

    const chooseColor = (nextColor: string) => {
        onChange(nextColor);
        setHexInput(nextColor.toUpperCase());
    };


    const changeHex = (text: string) => {
        if (text === "#000000") setWarning(true)
        else setWarning(false)
        setHexInput(text);
        const nextHex = `#${text.replace(/^#/, "").trim()}`;
        if (/^#[0-9A-Fa-f]{6}$/.test(nextHex)) {
            onChange(nextHex.toUpperCase());
        }
    };

    return (
        <>
            <Text className="text-xs text-center text-white/90 font-bold uppercase mb-2 mr-[1px]">
                {label}
            </Text>
            <Pressable
                onPress={openMenu}
                style={{ backgroundColor: value }}
                className="h-12 rounded-xl border border-white/20 active:opacity-80"
                accessibilityRole="button"
                accessibilityLabel={`Choose ${label.toLowerCase()}`}
                accessibilityHint="Opens the color picker"
            />

            {menuOpen && (
                <Modal
                    visible
                    transparent
                    animationType="fade"
                    onRequestClose={closeMenu}
                >
                    <KeyboardAvoidingView
                        behavior={Platform.OS === "ios" ? "padding" : "height"}
                        style={{
                            flex: 1,
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Pressable
                            className="absolute inset-0 bg-black/60"
                            onPress={closeMenu}
                        />

                        <View className="w-[85vw] rounded-3xl border border-white/10 bg-black p-4">
                            <Text className="text-2xl text-white font-bold">
                                Choose Color
                            </Text>

                            <View className="mt-4 flex-row gap-4">
                                <View
                                    style={{ backgroundColor: value, minHeight: 96 }}
                                    className="w-20 self-stretch rounded-xl border border-white/20"
                                />

                                <View
                                    className="flex-1 flex-row flex-wrap gap-2"
                                    style={{ alignContent: "flex-start" }}
                                >
                                    {PRESET_COLORS.map((preset) => {
                                        const selected =
                                            value.toLowerCase() === preset.toLowerCase();

                                        return (
                                            <Pressable
                                                key={preset}
                                                onPress={() => chooseColor(preset)}
                                                hitSlop={4}
                                                style={{ backgroundColor: preset }}
                                                className={
                                                    selected
                                                        ? "h-7 w-7 rounded-md border-2 border-white"
                                                        : "h-7 w-7 rounded-md border-2 border-transparent active:opacity-70"
                                                }
                                                accessibilityRole="button"
                                                accessibilityLabel={`Use color ${preset}`}
                                            />
                                        );
                                    })}
                                </View>
                            </View>

                            <Text className="text-xs text-white/50 font-bold uppercase mt-4 mb-1">
                                Hex
                            </Text>
                            <TextInput
                                value={hexInput}
                                onChangeText={changeHex}
                                placeholder="#FFFFFF"
                                placeholderTextColor="#6b7280"
                                autoCapitalize="characters"
                                autoCorrect={false}
                                maxLength={7}
                                className={`rounded-xl border bg-[#000] px-4 py-3 text-base text-white ${showHexError ? "border-red-500" : "border-white/10"
                                    }`}
                            />
                            {showHexError && (
                                <Text className="mt-1 text-xs text-red-400">
                                    Enter a 6-digit hex value.
                                </Text>
                            )}
                            {warning && (
                                <Text className="mt-1 text-xs text-yellow-400">
                                    This color might not be visible.
                                </Text>
                            )}

                            <Pressable
                                onPress={closeMenu}
                                className="mt-4 self-end rounded-xl bg-cyan-400 px-5 py-2 active:bg-cyan-500"
                                accessibilityRole="button"
                            >
                                <Text className="font-bold text-white">Done</Text>
                            </Pressable>
                        </View>
                    </KeyboardAvoidingView>
                </Modal>
            )}
        </>
    );
}
