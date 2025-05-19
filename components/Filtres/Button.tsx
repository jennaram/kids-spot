// Composant FiltreButton : bouton permettant de filtrer des lieux par type
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colorButtonFirst, colorButtonThird } from "@/app/style/styles";

type FiltreButtonProps = {
    type: string; // Nom du type (ex: "Parc", "Restaurant")
    typeId: number; // ID unique du type
    onPress: (typeId: number) => void; // Fonction appelée au clic (ne gère plus null)
    isSelected: boolean; // Booléen indiquant si le bouton est sélectionné
};

export function FiltreButton({ type, typeId, onPress, isSelected }: FiltreButtonProps) {
    // Gère le clic : ajoute ou retire le filtre
    const handlePress = () => {
        onPress(typeId);
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