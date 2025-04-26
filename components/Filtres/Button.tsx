// Composant FiltreButton : bouton permettant de filtrer des lieux par type

import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { colorButtonFirst, colorButtonThird } from "@/app/style/styles";

type FiltreButtonProps = {
    type: string; // Nom du type (ex: "Parc", "Restaurant")
    typeId: number; // ID unique du type
    onPress: (typeId: number | null) => void; // Fonction appelée au clic
    selectedTypeId: number | null; // ID du type actuellement sélectionné
};

export function FiltreButton({ type, typeId, onPress, selectedTypeId }: FiltreButtonProps) {
    // Vérifie si ce bouton est actuellement sélectionné
    const isSelected = selectedTypeId === typeId;

    // Gère le clic : sélectionne ou désélectionne
    const handlePress = () => {
        onPress(isSelected ? null : typeId);
    };

    return (
        <TouchableOpacity
            style={[styles.filterButton, isSelected && styles.filterButtonActive]} // Change de style si sélectionné
            onPress={handlePress}
        >
            <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
                {type} {/* Affiche le nom du type */}
            </Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    filterButton: {
        flex: 1,
        paddingVertical: 6,
        paddingHorizontal: 12,
        backgroundColor: colorButtonThird, // Couleur de fond par défaut
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colorButtonFirst,
        alignItems: 'center',
    },
    filterButtonActive: {
        backgroundColor: colorButtonFirst, // Couleur différente quand sélectionné
    },
    filterText: {
        color: '#000', // Texte noir par défaut
    },
    filterTextActive: {
        color: '#fff', // Texte blanc quand sélectionné
    },
});