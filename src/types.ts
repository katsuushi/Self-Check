// Database
// true = completed, false = skipped, number = measurable value, missing key = not completed
export type HabitHistory = Record<string, HabitHistoryValue>;
export type HabitHistoryValue = boolean | number;
export type DayStatus = 0 | 1 | 2;
export type HabitType = "yesNo" | "measurable";
export type HabitRow = typeof import("@/db/schema").habit.$inferSelect;
export type Habit = HabitRow;

// Service results
export type ReturnData<T> =
    | { success: true; data: T }
    | { success: false; error: string };

export type Success =
    | { success: true }
    | { success: false; error: string };

export type Result =
    | { success: true; data: Object | string }
    | { success: false; error: string };

export type ReturnFromEditDay =
    | { success: true; data: { newStreak: number; newBestStreak: number; newHistory: HabitHistory } }
    | { success: false; error: string }


// Habit form / modals
export type HabitFormValues = {
    title: string;
    description: string;
    color: string;
    habitType: HabitType;
    targetGoal: number;
};

export type CreateHabitProps = {
    isEditing?: boolean;
    initialTitle?: string;
    initialDescription?: string;
    initialColor?: string;
    initialType?: HabitType;
    initialTarget?: number;
    onClose: () => void;
    onSave: (values: HabitFormValues) => Promise<boolean> | boolean;
};

export type ColorPickerProps = {
    value: string;
    onChange: (color: string) => void;
    label?: string;
};

export type HabitTypeSelectProps = {
    value: HabitType;
    onChange: (value: HabitType) => void;
    label?: string;
};

export type MeasurableMarkMenuProps = {
    title: string;
    targetGoal: number;
    initialAmount?: number;
    onClose: () => void;
    onSubmit: (value: DayStatus, amount?: number) => void | Promise<void>;
};

export type AddHabitProps = {
    updateUI: () => void;
};

// Habit list / cards
export type HabitBodyProps = {
    id: number;
    title: string;
    color: string;
    description?: string | null;
    completed: boolean;
    streak: number;
    bestStreak: number;
    habitType: HabitType;
    targetGoal: number;
    createdAt: Date;
    habitHistory: HabitHistory;
    updateUI: () => void;
};

export type HabitDisplayProps = {
    refreshKey: number;
    updateUI: () => void;
};

// Habit overview
export type HabitData = {
    title: string;
    description: string;
    color: string;
    habitType: HabitType;
    targetGoal: number;
    habitHistory: HabitHistory;
    streak: number;
    bestStreak: number
    createdAt: Date;
    totalUnits?: number
};

export type HabitOverviewParams = {
    id: string;
    title: string;
    color: string;
    description?: string;
    completed: string;
    streak: string;
    bestStreak: string;
    habitType?: string;
    targetGoal?: string;
    createdAt: string;
    totalUnits?: string;
};

// Calendar
export type CellData = {
    date: string;
    status: DayStatus;
    onEditCell: (date: string, status: DayStatus) => void;
    onPressCell?: (date: string) => void;
};


export type NewStreaks = {
    newStreak: number;
    newBestStreak: number;
}
