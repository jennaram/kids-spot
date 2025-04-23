/**
 * Lien secondaire en bas d'écran
 * 
 * Responsabilités :
 * - Navigation vers d'autres écrans auth
 * - Deux variantes : lien seul ou texte + lien
 * - Style cohérent pour les actions secondaires
 * 
 * Props :
 * @param text?: string - Partie non cliquable
 * @param linkText: string - Partie cliquable
 * @param onPress: () => void
 * 
 * Usage :
 * <AuthFooterLink linkText="Mot de passe oublié?" [...] />
 * <AuthFooterLink text="Pas de compte?" linkText="S'inscrire" [...] />
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colorButtonFirst } from '../style/styles';

interface AuthFooterLinkProps {
  text?: string;
  linkText?: string;
  onPress: () => void;
  centered?: boolean;
}

const AuthFooterLink: React.FC<AuthFooterLinkProps> = ({
  text,
  linkText,
  onPress,
  centered = true
}) => {
  // Si c'est juste un texte cliquable (comme "Mot de passe oublié ?")
  if (!linkText) {
    return (
      <TouchableOpacity 
        style={[styles.linkContainer, centered && styles.centered]}
        onPress={onPress}
      >
        <Text style={styles.linkText}>{text}</Text>
      </TouchableOpacity>
    );
  }
  
  // Si c'est un texte avec une partie cliquable (comme "Vous n'avez pas de compte ? Inscrivez-vous")
  return (
    <View style={[styles.container, centered && styles.centered]}>
      <Text style={styles.text}>{text} </Text>
      <TouchableOpacity onPress={onPress}>
        <Text style={styles.linkText}>{linkText}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginTop: 10,
  },
  centered: {
    justifyContent: 'center',
    alignSelf: 'center',
  },
  linkContainer: {
    marginBottom: 30,
  },
  text: {
    color: '#555',
    fontSize: 14,
  },
  linkText: {
    color: colorButtonFirst,
    fontSize: 14,
    fontWeight: '500',
  },
});

export default AuthFooterLink;