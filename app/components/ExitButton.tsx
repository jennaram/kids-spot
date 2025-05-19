
/**
 * Bouton de fermeture / retour
 *
 * Responsabilités :
 * - Affiche une croix dans un cercle
 * - Peut être stylisé avec une prop `style`
 *
 * Props :
 * @param onPress - Callback au clic
 * @param style - Style externe additionnel (optionnel)
 *
 * Usage :
 * <ExitButton onPress={...} />
 */


import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

type ExitButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
};

export function ExitButton({ onPress, style }: ExitButtonProps) {
  return (
    <Pressable style={[styles.closeButton, style]} onPress={onPress}>
      <Text style={styles.closeButtonText}>×</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 10,
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 30,
    color: '#000000', // Croix noire
    fontWeight: '200', // Plus fin que 'bold'
    textAlign: 'center',
    lineHeight: 30,
    marginTop: -2,
  },
});

export default ExitButton;