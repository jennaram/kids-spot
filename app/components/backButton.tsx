import React from 'react';
import { TouchableOpacity, Image, StyleSheet, Platform } from 'react-native';
import { router } from 'expo-router';

interface BackButtonProps {
  /**
   * Destination de navigation alternative (optionnelle)
   * Si non fourni: retour à l'écran précédent
   */
  navigateTo?: string;
  /**
   * Fonction personnalisée à exécuter (optionnelle)
   * Prioritaire sur la navigation si fournie
   */
  onPress?: () => void;
  /**
   * Style personnalisé pour le conteneur
   */
  style?: object;
  /**
   * Style personnalisé pour l'icône
   */
  iconStyle?: object;
}

export const BackButton = ({ 
  navigateTo, 
  onPress, 
  style, 
  iconStyle 
}: BackButtonProps) => {
  const handlePress = () => {
    if (onPress) {
      onPress();
      return;
    }
    
    if (navigateTo) {
      router.push(navigateTo);
    } else {
      router.back();
    }
  };

  return (
    <TouchableOpacity
      style={[styles.button, style]}
      onPress={handlePress}
      hitSlop={styles.hitSlop}
      accessibilityRole="button"
      accessibilityLabel="Retour"
    >
      <Image
        source={require('../../assets/images/fleche_retour.png')}
        style={[styles.icon, iconStyle]}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    position: 'absolute',
    top: Platform.select({ ios: 50, android: 30 }),
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  icon: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
  hitSlop: {
    top: 20,
    bottom: 20,
    left: 20,
    right: 20,
  },
});

export default BackButton;