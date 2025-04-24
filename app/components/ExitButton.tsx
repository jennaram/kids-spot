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
    backgroundColor: '#28603E', // vert foncé
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 30,
    color: 'white', // croix blanche
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 30,
    marginTop: -2,
  },
});

export default ExitButton;
