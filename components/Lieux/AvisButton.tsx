import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { colorButtonFirst } from '@/app/style/styles';

/**
 * Composant bouton réutilisable pour les actions liées aux avis
 * @param {Object} props - Les propriétés du composant
 * @param {string} props.type - Type de bouton ('donner' ou 'voir')
 * @param {string} props.nomLieu - Nom du lieu concerné
 * @param {string} props.lieuId - ID du lieu concerné
 * @param {Function} props.onBeforeAction - Fonction à exécuter avant l'action (retourne boolean)
 */
interface AvisButtonProps {
  type: 'donner' | 'voir';
  nomLieu: string;
  lieuId: string;
  onBeforeAction?: () => boolean;
}

export const AvisButton: React.FC<AvisButtonProps> = ({ type, nomLieu, lieuId, onBeforeAction }) => {
  const router = useRouter();

  const handlePress = () => {
    // Si onBeforeAction est fourni, l'exécuter d'abord
    // et ne continuer que si elle retourne true
    if (onBeforeAction && !onBeforeAction()) {
      return; // Arrêter si onBeforeAction retourne false
    }
    
    const path = type === 'donner' ? '/avis' : '/ReadComments';
    router.push({
      pathname: path,
      params: { nomLieu, lieuId },
    });
  };

  const buttonText = type === 'donner' ? 'Donner mon avis' : 'Voir les avis';
  const buttonStyle = type === 'donner' ? styles.avisButton : styles.voirAvisButton;

  return (
    <TouchableOpacity
      style={[styles.baseButton, buttonStyle]}
      onPress={handlePress}
    >
      <Text style={styles.buttonText}>{buttonText}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  
  baseButton: {
    flex: 1,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  avisButton: {
    backgroundColor: colorButtonFirst,
  },
  voirAvisButton: {
    backgroundColor: colorButtonFirst,
  },
  buttonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default AvisButton;