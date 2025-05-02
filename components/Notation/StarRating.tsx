import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface StarRatingProps {
  rating: number;
  setRating: (rating: number) => void;
  maxRating?: number;
  containerStyle?: any;
  starStyle?: any;
  starSelectedStyle?: any;
  disabled?: boolean;
  label?: string;
  showLabel?: boolean;
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  setRating,
  maxRating = 5,
  containerStyle,
  starStyle,
  starSelectedStyle,
  disabled = false,
  label = "Note (sur 5)",
  showLabel = true
}) => {
  const ratingOptions = Array.from({ length: maxRating }, (_, i) => i + 1);

  return (
    <View style={[styles.container, containerStyle]}>
      {showLabel && label && (
        <Text style={styles.label}>{label}</Text>
      )}
      <View style={styles.ratingContainer}>
        <View style={styles.ratingGroup}>
          {ratingOptions.map((star) => (
            <TouchableOpacity 
              key={star} 
              onPress={() => !disabled && setRating(star)}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              disabled={disabled}
            >
              <Text style={[
                styles.star, 
                starStyle,
                star <= rating && styles.starSelected,
                star <= rating && starSelectedStyle
              ]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'left', // Centrer le label
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Conteneur principal centré
    width: '100%',
  },
  ratingGroup: {
    flexDirection: 'row',
    justifyContent: 'center', // Groupe d'étoiles centré
  },
  star: {
    fontSize: 30,
    color: '#ddd',
    marginHorizontal: 5, // Changé de marginRight à marginHorizontal pour un espacement égal
  },
  starSelected: {
    color: '#f1c40f',
  },
});

export default StarRating;