import React, { useState, useEffect } from 'react';
import { View, Text, Image, Button, StyleSheet, ScrollView, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { mockPoints } from './points';
import { useRouter } from 'expo-router';
import * as Location from 'expo-location';
import { useFocusEffect } from 'expo-router';

// 📍 Associe chaque type à une icône
const iconByType = {
  user: require('../assets/images/user-location.png'), // Assurez-vous que ce chemin est correct
};

export default function MapScreen() {
  const [points, setPoints] = useState([]);
  const router = useRouter();
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map'); // 🛠️ ça doit être dans le composant
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

  return (
    <View style={styles.container}>
      {viewMode === 'map' ? (
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: 48.8566,
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

      {/* 👇 Le bouton de switch est en bas de la vue */}
      <View style={styles.buttonContainer}>
      <Button title="Affichier la liste" onPress={() => router.push('/listelieux')} />
      </View>

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
  listContainer: {
    flex: 1,
    padding: 10,
  },
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
});
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
