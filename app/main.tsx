import React, { useState, useEffect } from 'react';
import { View, Image, Alert, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';

const iconByType = {
  user: require('../assets/images/user-location.png'), // Assurez-vous que ce chemin est correct
};

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Fonction pour démarrer le tracking
  const startLocationTracking = async () => {
    try {
      // Demande de permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission de localisation refusée');
        return;
      }

      // Vérification si le service est activé
      const enabled = await Location.hasServicesEnabledAsync();
      if (!enabled) {
        setError('Activez le service de localisation');
        return;
      }

      // Configuration des options
      const locationOptions = {
        accuracy: Location.Accuracy.High,
        distanceInterval: 5, // Mise à jour tous les 5 mètres
        timeInterval: 3000, // Mise à jour toutes les 3 secondes
      };

      // Abonnement aux mises à jour de position
      const sub = await Location.watchPositionAsync(
        locationOptions,
        (location) => {
          const { latitude, longitude } = location.coords;
          setUserLocation({ latitude, longitude });
        }
      );

      setLocationSubscription(sub);
    } catch (err) {
      console.error('Erreur de géolocalisation:', err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Une erreur inconnue est survenue');
      }
    }
  };

  // Gestion du cycle de vie
  useFocusEffect(
    React.useCallback(() => {
      startLocationTracking();
      
      return () => {
        if (locationSubscription) {
          locationSubscription.remove();
        }
      };
    }, [])
  );

  // Affichage conditionnel
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  if (!userLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement de la position...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        region={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
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
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </Marker>
      </MapView>
    </View>
  );
}