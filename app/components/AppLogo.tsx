import React from 'react';
import { Image, StyleSheet } from 'react-native';

interface AppLogoProps {
  size?: number;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 150 }) => (
  <Image 
    source={require('../../assets/images/Logo.png')} 
    style={[styles.logo, { width: size, height: size }]} 
  />
);

const styles = StyleSheet.create({
  logo: {
    marginBottom: 40,
  },
});

export default AppLogo;