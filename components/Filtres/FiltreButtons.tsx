import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import styles from 'app/style/add-place.styles';

interface Props {
  type: string;
  typeId: number;
  onPress: (id: number) => void;
  isSelected: boolean;
}

export const FiltreButton: React.FC<Props> = ({ type, typeId, onPress, isSelected }) => {
  return (
    <TouchableOpacity
      style={[styles.filtreButton, isSelected && { opacity: 0.8 }]}
      onPress={() => onPress(typeId)}
    >
      <Text style={styles.filtreButtonText}>{type}</Text>
    </TouchableOpacity>
  );
};
