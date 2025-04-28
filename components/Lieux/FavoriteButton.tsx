import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from "@/context/auth"; // Importez votre contexte d'authentification

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
  const { token } = useAuth(); // Récupérez le token d'authentification
  
  const handleFavoriteToggle = () => {
    // Si l'utilisateur n'est pas connecté, appeler simplement onToggle
    // sans changer l'état local du bouton favori
    if (!token) {
      if (onToggle) {
        onToggle(false);
      }
      return;
    }
    
    // Si l'utilisateur est connecté, changer l'état normalement
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
          name={token && isFavorite ? "favorite" : "favorite-border"}
          size={iconSize}
          color={token && isFavorite ? "red" : "white"}
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