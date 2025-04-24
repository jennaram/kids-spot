/**
 * Logo de l'application
 *
 * Responsabilités :
 * - Affiche le logo avec une taille personnalisable
 *
 * Props :
 * @param size - Taille du logo en pixels (par défaut : 150)
 *
 * Usage :
 * <AppLogo />
 * <AppLogo size={100} />
 */

import React from 'react';
import { Image, StyleSheet } from 'react-native';

type AppLogoProps = {
  size?: number;
};

export function AppLogo({ size = 150 }: AppLogoProps) {
  return (
    <Image
      source={require('../../assets/images/Logo.png')}
      style={[styles.logo, { width: size, height: size }]}
    />
  );
}

const styles = StyleSheet.create({
  logo: {
    marginBottom: 40,
  },
});

export default AppLogo;
