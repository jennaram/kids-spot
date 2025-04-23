import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import { router } from "expo-router";

type Props = {
    imageName: string,
    link: string,
    active: boolean
}

export function Button({ imageName, link, active }: Props) {
    return (
        <TouchableOpacity
            onPress={() => router.navigate(link)}
            style={[styles.button, active && styles.activeItem]}
        >
            <Ionicons
                name={imageName}
                size={26}
                color={active ? '#FFFFFF' : '#E0E0E0'}
            />
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    button: {
        padding: 8,
        borderRadius: 8,
    },
    activeItem: {
        backgroundColor: '#1E4D2B',
        borderRadius: 10,
    },
});

