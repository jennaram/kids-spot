// SearchBar.tsx
import React from 'react';
import { TextInput, StyleSheet } from 'react-native';

interface SearchBarProps {
    searchQuery: string;
    onSearchChange: (query: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchQuery, onSearchChange }) => {
    return (
        <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un lieu..."
            value={searchQuery}
            onChangeText={onSearchChange}
        />
    );
};

const styles = StyleSheet.create({
    searchInput: {
        height: 40,
        margin: 10,
        paddingHorizontal: 15,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#ccc',
        backgroundColor: '#fff',
    },
});

export default SearchBar;