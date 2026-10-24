import { View, Text } from "react-native";

type CellData = {
    date: string;
    completed: boolean;
}

export const CALENDAR_CELL_SIZE = 24;
export const CALENDAR_GAP = 2;
export const CALENDAR_ROWS = 7;
export const CALENDAR_HEIGHT =
    CALENDAR_ROWS * CALENDAR_CELL_SIZE + (CALENDAR_ROWS - 1) * CALENDAR_GAP;

export default function CalendarCell(props: CellData) {
    // 2020-11-11
    // 0123456789
    const day = props.date.slice(-2)

    return (
        <View
            style={{ width: CALENDAR_CELL_SIZE, height: CALENDAR_CELL_SIZE }}
            className={`rounded-sm items-center justify-center ${props.completed ? "bg-white" : "bg-black"}`}
        >
            <Text className={`text-[9px] leading-none font-semibold ${props.completed ? "text-black" : "text-white"}`}>
                {day[0] == "0" ? day.slice(-1) : day}
            </Text>
        </View>
    )

}
