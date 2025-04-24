/**
 * Bouton de soumission avec état de chargement
 *
 * Responsabilités :
 * - Affiche un bouton principal stylisé
 * - Affiche un texte de chargement si nécessaire
 *
 * Props :
 * @param title - Texte du bouton
 * @param onPress - Callback au clic
 * @param loading - Affiche un état de chargement (optionnel)
 *
 * Usage :
 * <SubmitButton title="Envoyer" onPress={...} loading={true} />
 */

import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colorButtonFirst } from '../../style/styles';

type SubmitButtonProps = {
  title: string;
  onPress: () => void;
  loading?: boolean;
};

export function SubmitButton({
  title,
  onPress,
  loading = false,
}: SubmitButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.submitButton, loading && styles.disabledButton]}
      onPress={onPress}
      disabled={loading}
      activeOpacity={0.8}
    >
      <Text style={styles.submitButtonText}>
        {loading ? 'En cours...' : title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  submitButton: {
    height: 50,
    backgroundColor: colorButtonFirst,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default SubmitButton;
