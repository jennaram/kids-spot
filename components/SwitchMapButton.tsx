// components/SwitchMapButton.tsx
import React from 'react';
import { TouchableOpacity, View, Image, Platform, StyleSheet } from 'react-native';
import { router } from 'expo-router';

interface SwitchMapButtonProps {
  isMapView: boolean;
}

export function SwitchMapButton({ isMapView }: SwitchMapButtonProps) {
  return (
    <View style={[
      styles.buttonContainer,
      { bottom: Platform.select({ ios: 100, android: 90 }) }
    ]}>
      <TouchableOpacity
        onPress={() => isMapView ? router.push('/Places') : router.back()}
        style={styles.button}
      >
        <Image
          source={isMapView 
            ? require('../assets/images/switchmap.png')
            : require('../assets/images/switchlieux.png')}
          style={styles.icon}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    right: 20,
    zIndex: 10,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    width: 30,
    height: 30,
  },
});

export default SwitchMapButton;