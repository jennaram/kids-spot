import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, SafeAreaView, ScrollView, TextStyle } from 'react-native';
import * as Font from 'expo-font';

// Charger la police BebasNeue-Regular
export const loadFonts = async () => {
  await Font.loadAsync({
    'BebasNeue-Regular': require('../../assets/fonts/BebasNeue-Regular.ttf'), // Assurez-vous que le chemin est correct
    'Inter-Regular': require('../../assets/fonts/Inter-Regular.ttf'),
  });
};

// Couleurs
export const colorButtonFirst = '#D37230';
export const colorButtonSecondary = '#28603E';
export const colorButtonThird = '#FFFFFF';

// Style pour les titres
export const fontTitle: TextStyle = {
  fontFamily: 'BebasNeue-Regular',
  fontStyle: 'normal',
  fontSize: 30,
};

export const fontSubtitle: TextStyle = {
    fontFamily: 'BebasNeue-Regular',
    fontWeight: 'bold',
    fontStyle: 'normal',
    fontSize: 18,
    };

export const ButtonStyle = {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
};

export const fontApp: TextStyle = {
  fontFamily: 'Inter-Regular',
  fontStyle: 'normal'
}