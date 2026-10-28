import { HabitHistory } from "@/types";
import { create } from "zustand";

type FlagsStore = {
    flags: HabitHistory,
    reset: () => void;
};

export const useFlagsStore = create<FlagsStore>((set) => ({
    flags: {},
    reset: () => set({ flags: {} }),
}));
