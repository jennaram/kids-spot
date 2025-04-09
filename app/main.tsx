import React from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Image, View, Text } from 'react-native';
import { StyleSheet} from 'react-native';

export default function MapScreen() {
    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 48.8566,      // Paris par exemple
            longitude: 2.3522,
            latitudeDelta: 0.05,
            longitudeDelta: 0.05,
          }}
        />
      </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      flex: 1,
    },
  });