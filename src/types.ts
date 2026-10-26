// Database
export type HabitHistory = Record<string, boolean>;
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
    | { success: true; data: Object | string}
    | { success: false; error: string };

export type ReturnFromEditDay = 
    | {success: true; data: {newStreak: number; newBestStreak: number; newHistory: HabitHistory}}
    | {success: false; error: string}


// Habit form / modals
export type HabitFormValues = {
    title: string;
    description: string;
    color: string;
};

export type CreateHabitProps = {
    isEditing?: boolean;
    initialTitle?: string;
    initialDescription?: string;
    initialColor?: string;
    onClose: () => void;
    onSave: (values: HabitFormValues) => Promise<boolean> | boolean;
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
    habitHistory: HabitHistory;
    streak: number;
    bestStreak: number
    createdAt: Date;
};

export type HabitOverviewParams = {
    id: string;
    title: string;
    color: string;
    description?: string;
    completed: string;
    streak: string;
    bestStreak: string;
    createdAt: string;
};

// Calendar
export type CellData = {
    date: string;
    completed: boolean;
    onEditCell: (date: string, value: boolean) => void;
};


export type NewStreaks = {
    newStreak: number;
    newBestStreak: number;
}
