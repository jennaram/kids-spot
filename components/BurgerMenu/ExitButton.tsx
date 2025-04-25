import { Ionicons } from "@expo/vector-icons";
import { Pressable, StyleProp, View, ViewStyle, StyleSheet } from "react-native";

type Props = {
    style: StyleProp<ViewStyle>,
    onPress: () => void;
};

export function ExitButton({ style, onPress }: Props) {
    return (
        <Pressable style={[styles.exitButton, style]} onPress={onPress}>
            <View>
                <Ionicons
                    name="close"
                    size={26}
                    color="#333"
                />
            </View>
        </Pressable>
    );
}

export const styles = StyleSheet.create({
    exitButton: {
        position: 'absolute',
        top: 40,
        zIndex: 999,
        padding: 2,
        backgroundColor: 'white',
        borderRadius: 20,
        elevation: 5, // ombre sur Android
        shadowColor: '#000', // ombre iOS
        shadowOffset: { width: 6, height: 5 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
    }
})

