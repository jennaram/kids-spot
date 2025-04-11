import 'react-native-gesture-handler';
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { mockPoints } from './points';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import * as Location from 'expo-location';

const iconByType = {
  culturel: require('../assets/images/iconfun.png'),
  restaurant: require('../assets/images/iconfood.png'),
  loisirs: require('../assets/images/iconcultural.png'),
  user: require('../assets/images/iconuser.png'),
};

export default function MapScreen() {
  const [points] = useState(mockPoints);
  const router = useRouter();
  const [viewMode] = useState<'map' | 'list'>('map');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const locationSubscriptionRef = React.useRef<Location.LocationSubscription | null>(null);

  const startLocationTracking = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission de localisation refusée');
        return;
      }

      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        setError('Activez le service de localisation');
        return;
      }

      // Get initial position quickly
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation(initialLocation.coords);

      // Set up watcher for updates
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          distanceInterval: 5,
          timeInterval: 3000,
        },
        (location) => {
          setUserLocation(location.coords);
        }
      );

      locationSubscriptionRef.current = sub;
    } catch (err) {
      console.error('Erreur de géolocalisation:', err);
      setError(err instanceof Error ? err.message : 'Une erreur inconnue est survenue');
    }
  }, []);

  const stopLocationTracking = useCallback(() => {
    if (locationSubscriptionRef.current) {
      locationSubscriptionRef.current.remove();
      locationSubscriptionRef.current = null;
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      startLocationTracking();

      return () => {
        stopLocationTracking();
      };
    }, [startLocationTracking, stopLocationTracking])
  );

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!userLocation) {
    return (
      <View style={styles.centered}>
        <Text>Chargement de la position...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {viewMode === 'map' ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          region={{
            latitude: userLocation.latitude,
            longitude: userLocation.longitude,
            latitudeDelta: 0.01,
            longitudeDelta: 0.01,
          }}
          showsUserLocation={false}
          showsMyLocationButton={false}
        >
          <Marker 
            coordinate={userLocation} 
            anchor={{ x: 0.5, y: 0.5 }}
            tracksViewChanges={false}
          >
            <Image 
              source={iconByType.user} 
              style={styles.userMarker} 
              resizeMode="contain" 
            />
          </Marker>

          {points.map((point) => (
            <Marker
              key={point.id}
              coordinate={{ latitude: point.latitude, longitude: point.longitude }}
              title={point.name}
              description={point.description}
            >
              <Image
                source={iconByType[point.type]}
                style={styles.pointMarker}
                resizeMode="contain"
              />
            </Marker>
          ))}
        </MapView>
      ) : (
        <ScrollView style={styles.listContainer}>
          {points.map((point) => (
            <View key={point.id} style={styles.item}>
              <Text style={styles.title}>{point.name}</Text>
              <Text>{point.description}</Text>
            </View>
          ))}
        </ScrollView>
      )}

      <View style={styles.buttonContainer}>
        <Button 
          title="Afficher la liste complète" 
          onPress={() => router.push('/listelieux')} 
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  listContainer: { flex: 1, padding: 10 },
  item: {
    marginBottom: 12,
    padding: 15,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  buttonContainer: {
    padding: 10,
    backgroundColor: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userMarker: {
    width: 40,
    height: 40,
  },
  pointMarker: {
    width: 40,
    height: 40,
  },
});