import React, { useState } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons'; // Icônes Material Design
import { useAuth } from "@/context/auth"; // Hook pour récupérer le token de l'utilisateur connecté
import { addFavorite, deleteFavorite } from '@/api/favoritesServices'; // Appels API pour ajouter ou supprimer un favori

// Définition des props attendues par le composant
type FavoriteButtonProps = {
  idPlace: number; // ID du lieu à ajouter ou supprimer des favoris
  initialState: boolean; // État initial du favori (vrai ou faux)
  onToggle?: (newState: boolean) => void; // Callback facultatif appelé lors d'un changement d'état
  position?: { top: number; right: number }; // Position absolue du bouton dans son parent
  iconSize?: number; // Taille de l’icône
  containerStyle?: object; // Style supplémentaire pour le conteneur du bouton
};

const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  idPlace,
  initialState = false,
  onToggle,
  position = { top: 25, right: 25 },
  iconSize = 24,
  containerStyle
}) => {
  // État local pour suivre si le lieu est actuellement dans les favoris
  const [isFavorite, setIsFavorite] = useState(initialState);

  // Récupère le token de l'utilisateur connecté via le contexte d'authentification
  const { token } = useAuth(); 

  // Fonction qui bascule l’état du favori (ajout ou suppression)
  const handleFavoriteToggle = async (idPlace: number) => {

    // Si l'utilisateur n'est pas connecté, on ne fait rien (ou on pourrait afficher un message)
    if (!token) {
      if (onToggle) {
        onToggle(false); // Appelle le callback avec false si défini
      }
      return;
    }

    try {
      if (!isFavorite) {
        // Si ce n’est pas encore un favori, on l’ajoute
        const { statusCode, data } = await addFavorite(idPlace, token);

        if (statusCode === 201) {
          setIsFavorite(true); // Mise à jour de l’état si succès
        } else {
          console.log(data); // Affiche les erreurs éventuelles
        }

      } else {
        // Si c’est déjà un favori, on le supprime
        const {statusCode, data} = await deleteFavorite(idPlace, token);

        if (statusCode === 204) {
          setIsFavorite(false); // Mise à jour de l’état si succès
        } else {
          console.log(data); // Affiche les erreurs éventuelles
        }
      }

      // Appelle le callback avec l’état *avant* le changement
      if (onToggle) {
        onToggle(isFavorite); 
      }

    } catch (error) {
      // En cas d'erreur réseau ou serveur
      console.error('Erreur lors de l\'ajout aux favoris:', error);
      alert('Erreur lors de l\'ajout aux favoris');
    }
  };

  return (
    // Conteneur du bouton avec position absolue et styles
    <View style={[styles.favoriteIconContainer, position, containerStyle]}>
      <TouchableOpacity onPress={() => handleFavoriteToggle(idPlace)}>
        <MaterialIcons
          // Choix de l'icône : pleine (favorite) ou vide (favorite-border)
          name={token && isFavorite ? "favorite" : "favorite-border"}
          size={iconSize}
          color={token && isFavorite ? "red" : "white"} // Rouge si favori, blanc sinon
        />
      </TouchableOpacity>
    </View>
  );
};

// Styles pour le conteneur de l’icône
const styles = StyleSheet.create({
  favoriteIconContainer: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
    borderRadius: 20,
    padding: 5,
    zIndex: 10, // S'assure que le bouton est au-dessus du contenu
  },
});

export default FavoriteButton;
