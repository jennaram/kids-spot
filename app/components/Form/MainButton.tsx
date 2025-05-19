/**
 * Bouton d'action principal pour l'authentification
 *
 * Responsabilités :
 * - Bouton principal stylisé avec état de chargement
 * - Feedback visuel au press
 * - Couleur personnalisable
 *
 * Props :
 * @param title - Texte du bouton
 * @param onPress - Fonction appelée au clic
 * @param loading - Affiche un indicateur de chargement (optionnel)
 * @param backgroundColor - Couleur personnalisable (optionnelle)
 * @param disabled - Désactive le bouton (optionnel)
 *
 * Usage :
 * <AuthButton title="Connexion" onPress={...} />
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colorButtonFirst } from '../../style/styles';

type AuthButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
  backgroundColor?: string;
  disabled?: boolean;
};

export function AuthButton({
  title,
  onPress,
  loading = false,
  backgroundColor = colorButtonFirst,
  disabled = false,
}: AuthButtonProps) {
  const buttonDisabled = loading || disabled;

  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        buttonDisabled && styles.disabledButton,
      ]}
      onPress={onPress}
      disabled={buttonDisabled}
      activeOpacity={0.8}
    >
      <Text style={styles.buttonText}>
        {loading ? 'Chargement...' : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 50,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default AuthButton;
