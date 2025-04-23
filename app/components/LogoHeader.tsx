/**
 * Composant d'en-tête pour les écrans d'authentification
 * 
 * Responsabilités :
 * - Affiche le logo de l'application de manière cohérente
 *  ET   Gère l'espacement standard sous le logo
 * - Permet une personnalisation simple de la taille
 * 
 * Props :
 * @param size?: number - Taille du logo (défaut: 200)
 * @param marginBottom?: number - Marge inférieure (défaut: 40)
 * 
 * Usage :
 * <AuthHeader /> // Valeurs par défaut
 * <AuthHeader size={150} marginBottom={30} />
 */

import React from 'react';
import { View, Image, StyleSheet } from 'react-native';

interface AuthHeaderProps {
  logoSize?: number;
  marginBottom?: number;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  logoSize = 200,
  marginBottom = 40
}) => {
  const appLogo = require('../../assets/images/Logo.png');
  
  return (
    <View style={[styles.logoContainer, { marginBottom }]}>
      <Image
        source={appLogo}
        style={[styles.logo, { width: logoSize, height: logoSize }]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  logoContainer: {
    alignItems: 'center',
  },
  logo: {
    resizeMode: 'contain',
  },
});

export default AuthHeader;