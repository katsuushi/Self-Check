import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import type { CellData, DayStatus } from "@/types";

export const CALENDAR_CELL_SIZE = 24;
export const CALENDAR_GAP = 2;
export const CALENDAR_ROWS = 7;
export const CALENDAR_HEIGHT =
    CALENDAR_ROWS * CALENDAR_CELL_SIZE + (CALENDAR_ROWS - 1) * CALENDAR_GAP;

export default function CalendarCell(props: CellData) {
    const [menuOpen, setMenuOpen] = useState(false);
    const day = props.date.slice(-2);

    const [year, month, dayNumber] = props.date.split("-").map(Number);
    const dateLabel = year && month && dayNumber
        ? new Date(year, month - 1, dayNumber).toLocaleDateString(undefined, {
            month: "short",
            day: "numeric",
            year: "numeric",
        })
        : props.date;

    const statusLabel =
        props.status === 1
            ? "Completed"
            : props.status === 2
                ? "Skipped"
                : "Not completed";

    const editDay = (value: DayStatus) => {
        props.onEditCell(props.date, value)
        setMenuOpen(false)
    }

    return (
        <>
            <Pressable
                onPress={() => setMenuOpen(true)}
                style={{ width: CALENDAR_CELL_SIZE, height: CALENDAR_CELL_SIZE }}
                className={`rounded-sm items-center justify-center active:opacity-60 ${props.status === 1 ? "bg-white" : props.status === 2 ? "bg-[#303030]" : "bg-black"}`}
                accessibilityRole="button"
                accessibilityLabel={`${dateLabel}, ${statusLabel}`}
            >
                <Text className={`text-[9px] leading-none font-semibold ${props.status === 1 ? "text-black" : "text-white"}`}>
                    {day[0] == "0" ? day.slice(-1) : day}
                </Text>
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

                        <View className="w-64 rounded-2xl border border-white/10 bg-[#0a0a0a] p-4">
                            <Text className="text-center text-lg font-bold text-white">
                                {dateLabel}
                            </Text>
                            <Text className="mt-1 text-center text-xs text-white/50">
                                {statusLabel}
                            </Text>

                            <View className="mt-4 flex-row justify-evenly">
                                <Pressable
                                    onPress={() => editDay(1)}
                                    className="h-14 w-14 items-center justify-center rounded-md active:bg-white/20"
                                    accessibilityRole="button"
                                    accessibilityLabel="Mark completed"
                                >
                                    <Text className="text-3xl font-bold text-white">✓</Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => editDay(2)}
                                    className="h-14 w-14 items-center justify-center rounded-md active:bg-white/20"
                                    accessibilityRole="button"
                                    accessibilityLabel="Skip day"
                                >
                                    <Text className="text-3xl font-bold text-white">—</Text>
                                </Pressable>

                                <Pressable
                                    onPress={() => editDay(0)}
                                    className="h-14 w-14 items-center justify-center rounded-md active:bg-white/20"
                                    accessibilityRole="button"
                                    accessibilityLabel="Mark not completed"
                                >
                                    <Text className="text-3xl font-bold text-white">✕</Text>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    )
}
