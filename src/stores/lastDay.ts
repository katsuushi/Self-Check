import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

type State = {
    value: string;
    setValue: (v: string) => void;
    clear: () => void;
};

export const useLastStore = create<State>()(
    persist(
        (set) => ({
            value: '',
            setValue: (value) => set({ value }),
            clear: () => set({ value: '' }),
        }),
        {
            name: 'lastDate-store',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
