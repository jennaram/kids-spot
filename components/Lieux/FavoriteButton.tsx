import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type FavoriteButtonProps = {
  initialState?: boolean;
  onToggle?: (newState: boolean) => void;
  position?: { top: number; right: number };
  iconSize?: number;
  containerStyle?: object;
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ 
  initialState = false, 
  onToggle, 
  position = { top: 25, right: 25 },
  iconSize = 24,
  containerStyle
}) => {
  const [isFavorite, setIsFavorite] = useState(initialState);
  
  const handleFavoriteToggle = () => {
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onToggle) {
      onToggle(newState);
    }
  };
  
  return (
    <View style={[styles.favoriteIconContainer, position, containerStyle]}>
      <TouchableOpacity onPress={handleFavoriteToggle}>
        <MaterialIcons 
          name={isFavorite ? "favorite" : "favorite-border"} 
          size={iconSize} 
          color={isFavorite ? "red" : "white"} 
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  favoriteIconContainer: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
    zIndex: 10,
  },
});

export default FavoriteButton;

