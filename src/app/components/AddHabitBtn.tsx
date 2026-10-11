import { Pressable, Text, View } from "react-native";

type AddHabitBtnProps = {
    toggle: () => void;
}

export default function AddHabitBtn(props: AddHabitBtnProps) {
    return (
        <Pressable
            onPress={() => props.toggle()}
            className="absolute bottom-8 right-8 w-16 h-16 rounded-md bg-cyan-400 active:bg-cyan-500 flex justify-center align-center"
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
