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
export const colorFourth = '#E9ECEF'

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
    fontSize: 18,
    };

//Style pour les bouttons
export const ButtonStyle = {
    borderRadius: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
};
