// Composant SearchBar : champ de recherche pour filtrer les lieux par nom

import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

// Typage des props attendues par SearchBar
interface SearchBarProps {
    searchQuery: string; // Le texte actuellement saisi dans la barre de recherche
    onSearchChange: (query: string) => void; // Fonction appelée à chaque changement de texte
}

// Définition du composant
const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
    return (
        <TextInput
            style={styles.searchInput} // Application des styles
            placeholder="Rechercher un lieu..." // Texte affiché quand l'input est vide
            value={searchQuery} // Valeur contrôlée de l'input
            onChangeText={onSearchChange} // Fonction déclenchée à chaque modification du texte
        />
    );
};

// Définition des styles pour le TextInput
const styles = StyleSheet.create({
    searchInput: {
        height: 40, // Hauteur du champ
        margin: 10, // Marge autour
        paddingHorizontal: 15, // Padding intérieur horizontal
        borderRadius: 20, // Coins arrondis
        borderWidth: 1, // Bordure fine
        borderColor: '#ccc', // Couleur grise claire pour la bordure
        backgroundColor: '#fff', // Fond blanc
    },
});

export default SearchBar;