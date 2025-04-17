import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Alert,
  Text,
  Platform,
  Linking,
  Button,
  TouchableOpacity,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';

// useEffect permet d'exécuter des effets secondaires (comme des appels API) dans les composants

import Layout from './components/LayoutNav';
// Importe le composant personnalisé qui structure la page avec une navigation

import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';

// Icônes personnalisées
const iconByType = {
  user: require('../assets/images/user-location.png'),
  switchmap: require('../assets/images/switchmap.png'),
};

export default function MapScreen() {
  const router = useRouter();
  const navigation = useNavigation(); // Si nécessaire plus tard
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationSubscription, setLocationSubscription] =
    useState<Location.LocationSubscription | null>(null);

  // Démarrage de la géolocalisation
  const startLocationTracking = async () => {
    try {
      // Android : Vérifie les services et permissions
      if (Platform.OS === 'android') {
        const [hasPlayServices, permissionStatus] = await Promise.all([
          Location.hasServicesEnabledAsync(),
          Location.requestForegroundPermissionsAsync(),
        ]);

        if (!hasPlayServices) {
          Alert.alert(
            'Services Google requis',
            'Cette application nécessite Google Play Services pour la géolocalisation',
            [
              {
                text: 'Activer',
                onPress: () => Linking.openSettings(),
              },
              {
                text: 'Annuler',
                style: 'cancel',
              },
            ]
          );
          return;
        }

        if (permissionStatus.status !== 'granted') {
          setError('Permission de localisation refusée');
          return;
        }
      } else {
        // iOS
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setError('Permission de localisation refusée');
          return;
        }
      }

      const initialLocation = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setUserLocation(initialLocation.coords);

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
      setError(
        Platform.OS === 'android'
          ? "Erreur des services Google - Redémarrez l'application"
          : 'Erreur de localisation'
      );
    }
  };

  // Timeout en cas de chargement long
  useEffect(() => {
    const timer = setTimeout(() => {
      if (Platform.OS === 'android' && !userLocation) {
        setError('Initialisation lente - Vérifiez votre connexion');
      }
    }, 10000);

    return () => clearTimeout(timer);
  }, [userLocation]);

  // Recharger la géoloc quand on revient sur l'écran
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
      <View
        style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}
      >
        <Text style={{ color: 'red', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        {Platform.OS === 'android' && (
          <Button
            title="Vérifier Google Play Services"
            onPress={() =>
              Linking.openURL('market://details?id=com.google.android.gms')
            }
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
    <Layout
    activeTab="map"
    onMapPress={() => navigation.navigate('Map')}
    onCalendarPress={() => navigation.navigate('Calendar')}
    onAddPress={() => navigation.navigate('Add')}
    onFavoritePress={() => navigation.navigate('Favorites')}
  >
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
        showsMyLocationButton={true}
        loadingEnabled={true}
        userLocationPriority="high"
        userLocationUpdateInterval={5000}
        provider={Platform.OS === 'android' ? 'google' : undefined}
      >
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

      <TouchableOpacity
        onPress={() => router.push('/listelieux')}
        style={{
          position: 'absolute',
          bottom: 20,
          right: 20,
          borderRadius: 50,
          padding: 10,
        }}
      >
        <Image
          source={iconByType.switchmap}
          style={{ width: 40, height: 40 }}
        />
      </TouchableOpacity>
      </View>
    </Layout>
  );
}
