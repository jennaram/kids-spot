import { Ionicons } from "@expo/vector-icons";
import { Pressable, View } from "react-native";

type Props = {
    onPress: () => void;
};

export function ExitButton({ onPress }: Props) {
    return (
        <Pressable onPress={onPress}>
            <View>
                <Ionicons
                    name="close-circle"
                    size={26}
                    color="#E0E0E0"
                />
            </View>
        </Pressable>
    );
}