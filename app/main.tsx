import React, { useState, useEffect } from 'react';
import { View, Image, Alert, Text, Platform, Linking, Button, TouchableOpacity } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useNavigation } from '@react-navigation/native';  // Importation de useNavigation

const iconByType = {
  user: require('../assets/images/user-location.png'),// Icône de la liste (assure-toi que l'icône existe bien)
  switchmap: require('../assets/images/switchmap.png'),
};

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationSubscription, setLocationSubscription] = useState<Location.LocationSubscription | null>(null);
  const [error, setError] = useState<string | null>(null);

  const navigation = useNavigation();  // Création de la navigation

  // Fonction pour démarrer le tracking
  const startLocationTracking = async () => {
    try {
      // Vérification spécifique Android
      if (Platform.OS === 'android') {
        const [hasPlayServices, permissionStatus] = await Promise.all([
          Location.hasServicesEnabledAsync(),
          Location.requestForegroundPermissionsAsync()
        ]);

        if (!hasPlayServices) {
          Alert.alert(
            'Services Google requis',
            'Cette application nécessite Google Play Services pour la géolocalisation',
            [
              {
                text: 'Activer',
                onPress: () => Linking.openSettings()
              },
              { 
                text: 'Annuler', 
                style: 'cancel' 
              }
            ]
          );
          return;
        }

        if (permissionStatus.status !== 'granted') {
          setError('Permission de localisation refusée');
          return;
        }
      } 
      // Logique iOS
      else {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission de localisation refusée');
          return;
        }
      }

      // Récupération de la position
      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High
      });
      setUserLocation(initialLocation.coords);

      // Abonnement aux mises à jour
      const sub = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          distanceInterval: 10,
          timeInterval: 5000,
          mayShowUserSettingsDialog: true,
        },
        (location) => {
          setUserLocation(location.coords);
        }
      );

      setLocationSubscription(sub);

    } catch (err) {
      console.error('Erreur de géolocalisation:', err);
      setError(Platform.OS === 'android' 
        ? 'Erreur des services Google - Redémarrez l\'application'
        : 'Erreur de localisation');
    }
  };

  // Timeout de secours pour Android
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Platform.OS === 'android' && !userLocation) {
        setError('Initialisation lente - Vérifiez votre connexion');
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [userLocation]);

  // Gestion du cycle de vie
  useFocusEffect(
    React.useCallback(() => {
      startLocationTracking();
      return () => {
        locationSubscription?.remove();
      };
    }, [])
  );

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>{error}</Text>
        {Platform.OS === 'android' && (
          <Button
            title="Vérifier Google Play Services"
            onPress={() => Linking.openURL('market://details?id=com.google.android.gms')}
          />
        )}
      </View>
    );
  }

  if (!userLocation) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Chargement de votre position...</Text>
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
        showsUserLocation={false} // Désactivé car nous utilisons notre propre marqueur
        showsMyLocationButton={true}
        loadingEnabled={true}
        userLocationPriority="high"
        userLocationUpdateInterval={5000}
        provider={Platform.OS === 'android' ? 'google' : undefined}
      >
        {/* Marqueur personnalisé pour iOS et Android */}
        <Marker
          coordinate={userLocation}
          anchor={{ x: 0.5, y: 0.5 }}
          tracksViewChanges={true}
        >
          <Image
            source={iconByType.user}
            style={{ width: 40, height: 40 }}
            resizeMode="contain"
          />
        </Marker>
      </MapView>

      {/* Bouton pour naviguer vers listelieux.tsx */}
      <TouchableOpacity
        onPress={() => router.push('/listelieux')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          borderRadius: 50, // Pour donner un effet circulaire
          padding: 10,
        }}
      >
         <Image
          source={iconByType.switchmap}  // L'icône que tu veux afficher
          style={{ width: 40, height: 40 }} // Taille de l'icône
        />
      </TouchableOpacity>
    </View>
  );
}
