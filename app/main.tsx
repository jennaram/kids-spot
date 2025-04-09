import React from 'react';
import { useState, useEffect } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { Image, View, Text } from 'react-native';
import { StyleSheet} from 'react-native';
import { mockPoints } from './points';

const iconByType = {
  culturel: require('../assets/images/iconfun.png'),
  restaurant: require('../assets/images/iconfood.png'),
  loisirs: require('../assets/images/iconcultural.png'),
};

export default function MapScreen() {
  const [points, setPoints] = useState([]);

  useEffect(() => {
    setPoints(mockPoints); // simule un fetch de base de données
  }, []);

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
          >
          {points.map((point) => (
             <Marker
             key={point.id}
             coordinate={{
               latitude: point.latitude,
               longitude: point.longitude,
             }}
             title={point.name}
             description={point.description}
            >
            <Image
            source={iconByType[point.type]}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
          </Marker>
          ))}
        </MapView>
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