import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, SafeAreaView, ScrollView, TextStyle } from 'react-native';
import * as Font from 'expo-font';

// Charger la police BebasNeue-Regular
export const loadFonts = async () => {
  await Font.loadAsync({
    'BebasNeue-Regular': require('../../assets/fonts/BebasNeue-Regular.ttf'), 
  });
};

// Couleurs
export const colorButtonFirst = '#D37230';
export const colorButtonSecondary = '#28603E';
export const colorButtonThird = '#FFFFFF';
export const colorFourth = '#E9ECEF';

// Style pour les titres
export const fontTitle: TextStyle = {
  fontFamily: 'BebasNeue-Regular',
  fontStyle: 'normal',
  fontSize: 30,
};

//Style pour les sous-titres
export const fontSubtitle: TextStyle = {
    fontFamily: 'BebasNeue-Regular',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 15,
};

//Style pour les bouttons
export const ButtonStyle = {
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderWidth: 1,           // Épaisseur de la bordure
    borderColor: '#000000',   // Couleur de la bordure (noire)
};

// Fusion de la branche 'develop' dans 'stylisation-card-evenement'
// - Mise à jour des styles globaux, y compris la gestion des polices et des couleurs.
// - Intégration des dernières modifications de la branche principale pour synchroniser les fonctionnalités.
// - Préparation pour la stylisation des cartes d'événements.
