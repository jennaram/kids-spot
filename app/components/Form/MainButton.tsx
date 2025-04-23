/**
 * Bouton d'action principal pour l'authentification
 * 
 * Responsabilités :
 * - Bouton principal stylisé avec état de chargement
 * - Feedback visuel au press
 * - Couleur personnalisable
 * 
 * Props :
 * @param title: string - Texte du bouton
 * @param onPress: () => void
 * @param loading?: boolean - Affiche un indicateur
 * @param backgroundColor?: string - Couleur optionnelle
 * 
 * Usage :
 * <AuthButton title="Connexion" [...] />
 */


import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { colorButtonFirst } from '../../style/styles';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  backgroundColor?: string;
  disabled?: boolean;
}

const AuthButton: React.FC<AuthButtonProps> = ({
  title,
  onPress,
  loading = false,
  backgroundColor = colorButtonFirst,
  disabled = false
}) => {
  const buttonDisabled = loading || disabled;
  
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor },
        buttonDisabled && styles.disabledButton
      ]}
      onPress={onPress}
      disabled={buttonDisabled}
    >
      <Text style={styles.buttonText}>
        {loading ? 'Chargement...' : title}
      </Text>
    </TouchableOpacity>
  );
};

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