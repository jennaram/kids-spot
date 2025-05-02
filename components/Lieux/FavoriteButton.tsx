import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from "@/context/auth";
import { useAddFavorite } from '@/hooks/favorite/useAddFavorite';
import { useDeleteFavorite } from '@/hooks/favorite/useDeleteFavorite';
import { useLocation } from '@/context/locate/LocationContext';

/**
 * Props pour le composant FavoriteButton
 * 
 * @typedef FavoriteButtonProps
 * @property {number} idPlace - Identifiant unique du lieu à ajouter/retirer des favoris
 * @property {boolean} initialState - État initial du bouton favori (true = en favori, false = pas en favori)
 * @property {(newState: boolean) => void} [onToggle] - Fonction de callback optionnelle déclenchée lors du changement d'état
 * @property {{ top: number; right: number }} [position] - Positionnement optionnel du bouton (par défaut: { top: 25, right: 25 })
 * @property {number} [iconSize] - Taille optionnelle de l'icône favori (par défaut: 24)
 * @property {object} [containerStyle] - Styles additionnels optionnels pour le conteneur
 */
type FavoriteButtonProps = {
  idPlace: number;
  initialState: boolean;
  onToggle?: (newState: boolean) => void;
  position?: { top: number; right: number };
  iconSize?: number;
  containerStyle?: object;
};

/**
 * Composant FavoriteButton
 * 
 * Un composant bouton réutilisable qui permet aux utilisateurs d'ajouter ou de supprimer des lieux de leurs favoris.
 * Le composant gère son propre état mais peut également notifier les composants parents des changements d'état.
 * Il s'intègre avec l'authentification pour garantir que seuls les utilisateurs connectés peuvent interagir avec les favoris.
 * 
 * Fonctionnalités:
 * - Affiche différentes icônes pour les états favoris et non favoris
 * - Gère les appels API pour ajouter et supprimer des favoris
 * - Rafraîchit le contexte des favoris après les changements d'état
 * - Fournit un retour visuel pendant les opérations API (désactivé pendant le chargement)
 * - Position, taille et style personnalisables
 * 
 * Exemple d'utilisation:
 * ```tsx
 * <FavoriteButton 
 *   idPlace={123}
 *   initialState={false}
 *   onToggle={(estFavori) => console.log(`Le lieu est maintenant ${estFavori ? 'en favori' : 'retiré des favoris'}`)}
 *   position={{ top: 10, right: 10 }}
 *   iconSize={32}
 * />
 * ```
 * 
 * @param {FavoriteButtonProps} props - Propriétés du composant
 * @returns {JSX.Element} Composant rendu
 */
const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  idPlace,
  initialState = false,
  onToggle,
  position = { top: 25, right: 25 },
  iconSize = 24,
  containerStyle,
}) => {
  // État pour suivre si le lieu actuel est dans les favoris
  const [isFavorite, setIsFavorite] = useState(initialState);
  
  // Récupère le token d'authentification pour vérifier si l'utilisateur est connecté
  const { token } = useAuth();
  
  // Hooks personnalisés pour ajouter/supprimer des favoris avec états de chargement et résultats
  const {
    submitFavorite,
    loading: adding,
    success: addSuccess,
    error: addError,
  } = useAddFavorite();
  
  const {
    removeFavorite,
    loading: deleting,
    success: deleteSuccess,
    error: deleteError,
  } = useDeleteFavorite();
  
  // Accède à la méthode pour rafraîchir les favoris dans le contexte de localisation
  const { refreshFavorites } = useLocation();
  
  /**
   * Effet pour gérer les mises à jour d'état après que les opérations API sont terminées
   * Met à jour l'état interne et déclenche le callback onToggle si fourni
   */
  useEffect(() => {
    if (addSuccess) {
      setIsFavorite(true);
      refreshFavorites();
      onToggle?.(true);
    } else if (deleteSuccess) {
      setIsFavorite(false);
      refreshFavorites();
      onToggle?.(false);
    }
  }, [addSuccess, deleteSuccess]);

  /**
   * Gère le basculement de l'état favori
   * 
   * Cette fonction est déclenchée lorsque l'utilisateur appuie sur le bouton favori.
   * - Vérifie si l'utilisateur est connecté (a un token)
   * - Exécute l'opération d'ajout ou de suppression appropriée
   * - L'état du composant sera mis à jour via l'effet useEffect ci-dessus
   */
  const handleFavoriteToggle = async () => {
    if (!token) {
      onToggle?.(false);
      return;
    }
    
    if (!isFavorite) {
      await submitFavorite(idPlace, token);
    } else {
      await removeFavorite(idPlace, token);
    }
  };

  return (
    <View style={[styles.favoriteIconContainer, position, containerStyle]}>
      <TouchableOpacity onPress={handleFavoriteToggle} disabled={adding || deleting}>
        <MaterialIcons
          name={token && isFavorite ? "favorite" : "favorite-border"}
          size={iconSize}
          color={token && isFavorite ? "red" : "white"}
        />
      </TouchableOpacity>
    </View>
  );
};

/**
 * Styles pour le composant FavoriteButton
 * 
 * Définit l'apparence visuelle du conteneur du bouton favori:
 * - Position absolue pour le placer précisément sur d'autres éléments
 * - Fond semi-transparent pour améliorer la visibilité
 * - Coins arrondis pour une apparence moderne
 * - Indice z élevé pour s'assurer qu'il apparaît au-dessus des autres éléments
 */
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
