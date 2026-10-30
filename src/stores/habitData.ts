import { HabitHistory } from "@/types";
import { create } from "zustand";

type FlagsStore = {
    flags: HabitHistory,
    setFlags: (flags: HabitHistory) => void;
    reset: () => void;
};

export const useFlagsStore = create<FlagsStore>((set) => ({
    flags: {},
    setFlags: (flags) => set({ flags }),
    reset: () => set({ flags: {} }),
}));
