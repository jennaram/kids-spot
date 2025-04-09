import React from 'react';
import MapView from 'react-native-maps';
import { View, Text } from 'react-native';
import { StyleSheet} from 'react-native';

export default function MapPage() {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text>Voici la page Carte 🗺️</Text>
      </View>
    );
  }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    width: '100%',
    height: '100%',
  },
});
