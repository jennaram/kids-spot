import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colorButtonFirst, colorButtonThird } from "@/app/style/styles";

type FiltreButtonProps = {
    type: string;
    typeId: number;
    onPress: (typeId: number | null) => void;
    selectedTypeId: number | null;
};

export function FiltreButton({ type, typeId, onPress, selectedTypeId }: FiltreButtonProps) {
    const isSelected = selectedTypeId === typeId;

    const handlePress = () => {
        onPress(isSelected ? null : typeId);
    };

    return (
        <TouchableOpacity
            style={[styles.filterButton, isSelected && styles.filterButtonActive]}
            onPress={handlePress}
        >
            <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                {type}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    filterButton: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: colorButtonThird,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colorButtonFirst,
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: colorButtonFirst,
    },
    filterText: {
        color: '#000',
    },
    filterTextActive: {
        color: '#fff',
    },
});