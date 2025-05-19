import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import styles from '@/app/style/StarRating.styles';
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



export default StarRating;