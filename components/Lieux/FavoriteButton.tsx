import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from "@/context/auth";
import { useAddFavorite } from '@/hooks/favorite/useAddFavorite';
import { useDeleteFavorite } from '@/hooks/favorite/useDeleteFavorite';
import { useLocation } from '@/context/locate/LocationContext';

type FavoriteButtonProps = {
  idPlace: number;
  initialState: boolean;
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
  containerStyle,
}) => {
  const [isFavorite, setIsFavorite] = useState(initialState);

  const { token } = useAuth();
  const {
    submitFavorite,
    loading: adding,
    success: addSuccess,
    error: addError,
    reset: resetAddFavorite,
  } = useAddFavorite();

  const {
    removeFavorite,
    loading: deleting,
    success: deleteSuccess,
    error: deleteError,
    reset: resetDeleteFavorite,
  } = useDeleteFavorite();

  const { refreshFavorites } = useLocation();

  useEffect(() => {
    if (addSuccess) {
      setIsFavorite(true);
      refreshFavorites();
      onToggle?.(true);
      resetAddFavorite();
    } else if (deleteSuccess) {
      setIsFavorite(false);
      refreshFavorites();
      onToggle?.(false);
      resetDeleteFavorite();
    }
  }, [addSuccess, deleteSuccess]);

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