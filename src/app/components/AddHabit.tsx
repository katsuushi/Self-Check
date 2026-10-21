import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { createHabit } from "../../services/createHabit";
import CreateHabit from "./CreateHabit";

type AddHabitProps = {
    updateUI: () => void; // Makes the habitDisplay component refetch the habits
}

export default function AddHabit(props: AddHabitProps) {
    const [visible, setVisible] = useState(false);

    if (!visible) {
        return (
            <Pressable
                onPress={() => setVisible(true)}
                className="absolute bottom-12 right-12 w-16 h-16 rounded-md bg-cyan-400 active:bg-cyan-500 flex justify-center align-center"
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

    return (
        <CreateHabit
            onClose={() => setVisible(false)}
            onSave={async ({ title, description, color }) => {
                const res = await createHabit(title, description, color);
                if (res.success) {
                    props.updateUI();
                    return true;
                }
                console.log(res.error);
                return false;
            }}
        />
    );
}
