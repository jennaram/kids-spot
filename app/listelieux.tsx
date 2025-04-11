import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { mockPoints } from './points';
import * as Location from 'expo-location';
import { router } from 'expo-router';

const iconByType = {
  listIcon: require('../assets/images/switchlieux.png'), // Icône pour switch vers la map
};

// Fonction pour calculer la distance entre deux points GPS (en km)
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Rayon de la Terre en km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export default function ListeLieux() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Permission localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {mockPoints.map((point) => {
          const distance =
            userLocation
              ? getDistanceFromLatLonInKm(
                  userLocation.latitude,
                  userLocation.longitude,
                  point.latitude,
                  point.longitude
                ).toFixed(2)
              : null;

          return (
            <TouchableOpacity key={point.id} style={styles.item}>
              <Text style={styles.title}>{point.name}</Text>
              <Text style={styles.description}>{point.description}</Text>

              {distance && (
                <Text style={styles.info}>Distance : {distance} km</Text>
              )}

              {point.horaires && (
                <Text style={styles.info}>Horaires : {point.horaires}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bouton en bas à droite */}
      <TouchableOpacity
        onPress={() => router.push('/main')}
        style={styles.floatingButton}
      >
        <Image
          source={iconByType.listIcon}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100, // pour éviter que la liste passe sous le bouton
  },
  item: {
    marginBottom: 12,
    padding: 16,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    borderRadius: 50,
    padding: 10,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
