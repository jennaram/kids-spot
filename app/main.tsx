import React, { useState } from 'react';
import { View, Image, TouchableOpacity, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect, useRouter } from 'expo-router';

// Définition des icônes personnalisées
const iconByType = {
  user: require('../assets/images/user-location.png'), // Icône pour la position utilisateur
};

export default function MapScreen() {
  const router = useRouter();
  // États pour gérer la position utilisateur et les erreurs
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  /**
   * Fonction pour démarrer le tracking de la position
   * Demande les permissions et récupère la position actuelle
   */
  const startLocationTracking = async () => {
    try {
      // 1. Demande de permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setError('Permission refusée');
        return;
      }

      // 2. Récupération de la position
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    } catch (err) {
      setError('Erreur de géolocalisation');
      console.error(err);
    }
  };

  // Rafraîchit la position quand l'écran obtient le focus
  useFocusEffect(
    React.useCallback(() => {
      startLocationTracking();
      return () => {}; // Nettoyage
    }, [])
  );

  // Affichage des erreurs
  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
      </View>
    );
  }

  // Affichage pendant le chargement
  if (!userLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement de la position...</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {/* Carte principale */}
      <MapView
        style={{ flex: 1 }}
        region={userLocation ? {
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.005, // Niveau de zoom
          longitudeDelta: 0.005,
        } : undefined}
        showsUserLocation={false} // Désactivé car on utilise un marqueur personnalisé
      >
        {/* Marqueur pour la position utilisateur */}
        {userLocation && (
          <Marker coordinate={userLocation}>
            <Image
              source={iconByType.user}
              style={{ width: 40, height: 40 }}
            />
          </Marker>
        )}
      </MapView>

      {/* Bouton flottant pour ajouter un lieu */}
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 30,
          right: 20,
          backgroundColor: '#FF6B6B', // Couleur rouge vif
          width: 60,
          height: 60,
          borderRadius: 30, // Forme circulaire
          justifyContent: 'center',
          alignItems: 'center',
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 5,
          elevation: 5, // Ombre sur Android
        }}
        onPress={() => router.push('/add-place')} // Navigation vers l'écran d'ajout
      >
        <Text style={{ color: 'white', fontSize: 30, marginBottom: 3 }}>+</Text>
      </TouchableOpacity>
    </View>
  );
}