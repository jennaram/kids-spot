/**
 * Séparateur visuel avec texte central
 * 
 * Responsabilités :
 * - Sépare les différentes méthodes d'authentification
 * - Ligne horizontale avec texte au centre
 * - Texte personnalisable
 * 
 * Props :
 * @param text?: string - Texte central (défaut: "ou")
 * 
 * Usage :
 * <AuthSeparator />
 * <AuthSeparator text="Ou bien" />
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface AuthSeparatorProps {
  text?: string;
}

const AuthSeparator: React.FC<AuthSeparatorProps> = ({ text = 'ou' }) => (
  <View style={styles.separatorContainer}>
    <View style={styles.separatorLine} />
    <Text style={styles.separatorText}>{text}</Text>
    <View style={styles.separatorLine} />
  </View>
);

const styles = StyleSheet.create({
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    width: 50,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
});

export default AuthSeparator;