import { Modal, Pressable, Text, View } from "react-native";
import type { FirstTimePopupProps } from "@/types";

export default function FirstTimePopup({ onClose }: FirstTimePopupProps) {
    return (
        <Modal visible transparent animationType="fade" onRequestClose={onClose}>
            <View className="flex-1 items-center justify-center bg-black/60 px-6">
                <View className="w-72 rounded-2xl bg-[#101010] p-5">
                    <Text className="text-lg font-bold text-white">
                        Early build
                    </Text>

                    <Text className="mt-2 text-sm leading-5 text-white/70">
                        Thank you for trying SelfCheck! It's one of the first releases of the app, so bugs and glitches may occur. In that case I would highly encourage you to file an issue on the app's GitHub. Have a great day!
                    </Text>

                    <Pressable
                        onPress={onClose}
                        accessibilityRole="button"
                        accessibilityLabel="Dismiss early build notice"
                        className="mt-4 w-full items-center justify-center rounded-lg bg-white/10 py-3 active:bg-white/20"
                    >
                        <Text className="text-base font-semibold text-white">OK</Text>
                    </Pressable>
                </View>
            </View>
        </Modal>
    );
}
