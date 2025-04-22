import { View, Text, Image, StyleSheet, TouchableOpacity, Animated, SafeAreaView, ScrollView, TextStyle } from 'react-native';
import * as Font from 'expo-font';

// Charger la police BebasNeue-Regular
export const loadFonts = async () => {
  await Font.loadAsync({
    'BebasNeue-Regular': require('../../assets/fonts/BebasNeue-Regular.ttf'), // Assurez-vous que le chemin est correct
  });
};

// Couleurs
export const colorButtonFirst = '#D37230';
export const colorButtonSecondary = '#28603E';
export const colorButtonThird = '#FFFFFF';

// Style pour les titres
export const fontTitle: TextStyle = {
  fontFamily: 'BebasNeue-Regular',
  fontWeight: 'bold',
  fontStyle: 'normal',
  fontSize: 24,
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
    marginTop: 40,
    alignSelf: 'flex-end',
};