import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from "@/context/auth"; // Importez votre contexte d'authentification
import addFavorite  from '@/api/fetchAddFavorite'; // Assurez-vous que le chemin est correct
import { Alert } from 'react-native';
import { useLocation } from '@/context/locate';
type FavoriteButtonProps = {
  idPlace: number;
  initialState?: boolean;
  onToggle?: (newState: boolean) => void;
  position?: { top: number; right: number };
  iconSize?: number;
  containerStyle?: object;
};



const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  idPlace,
  initialState = false,
  onToggle,
  position = { top: 25, right: 25 },
  iconSize = 24,
  containerStyle
}) => {
  const [isFavorite, setIsFavorite] = useState(initialState);
  const { token } = useAuth(); // Récupérez le token d'authentification
  const { favorites } = useLocation();
  console.log('favoris', favorites);
  const handleFavoriteToggle = async (idPlace: number) => {
    // Si l'utilisateur n'est pas connecté, appeler simplement onToggle
    // sans changer l'état local du bouton favori
    try{
    if (!token) {
      if (onToggle) {
        onToggle(false);
      }
      return;
    }
    const response = await addFavorite(idPlace, token);
    console.log('response', response);

    console.log('id', idPlace);
    Alert.alert('Succès', 'Lieu ajouté aux favoris avec succès !');
    // Si l'utilisateur est connecté, changer l'état normalement
    const newState = !isFavorite;
    setIsFavorite(newState);
    if (onToggle) {
      onToggle(newState);
    }
  } catch (error) {
    console.error('Erreur lors de l\'ajout aux favoris:', error);
    alert('Erreur lors de l\'ajout aux favoris');
  }
    
  };
  
  return (
    <View style={[styles.favoriteIconContainer, position, containerStyle]}>
      <TouchableOpacity onPress={() => handleFavoriteToggle(idPlace)}>
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