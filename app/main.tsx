import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Alert,
  Text,
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { router, useFocusEffect, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import Layout from './components/LayoutNav';
import MenuBurger from './components/menuburger';
import fetchNearbyPlaces from '@/api/fetchNearbyPlaces';
import getUserLocation from '@/hooks/localisation';
import { Navigation } from '@/components/Navigation';

// Icônes personnalisées
const iconByType = {
  user: require('../assets/images/user-location.png'),
  switchmap: require('../assets/images/switchmap.png'),
};

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const [nearbyPlaces, setNearbyPlaces] = useState<any[] | null>(null);

  const [error, setError] = useState<string | null>(null);

  const loadNearbyPlaces = async (lat: number, lng: number) => {
    const placesData = await fetchNearbyPlaces(lat, lng);
    if (placesData && placesData.status === 'success' && placesData.data) {
      setNearbyPlaces(placesData.data);
    } else {
      console.error('Erreur lors de la récupération des lieux à proximité');
      // Vous pouvez éventuellement afficher une erreur à l'utilisateur ici
    }
  };

  const fetchLocationAndPlaces = async () => {
    const location = await getUserLocation();
    if (location) {
      setUserLocation(location);
      setError(null);
      // Une fois la localisation obtenue, chargez les lieux à proximité
      loadNearbyPlaces(location.latitude, location.longitude);
    } else {
      setError('Impossible d\'obtenir la localisation.');
    }
  };

  useEffect(() => {
    fetchLocationAndPlaces();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchLocationAndPlaces();
      return () => { };
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
        {Platform.OS === 'android' && error.includes('Google Play services') && (
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
    <View style={styles.container}>
      <MapView
        style={styles.map}
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
            style={styles.userMarker}
            resizeMode="contain"
          />
        </Marker>

        {nearbyPlaces && nearbyPlaces.length > 0 ? (
          nearbyPlaces.map((item) => (
            <Marker
              key={item.id}
              coordinate={{
                latitude: item.position.latitude,
                longitude: item.position.longitude,
              }}
              title={item.nom}
              description={item.description}
            >
              <View style={{ backgroundColor: 'blue', padding: 5, borderRadius: 10 }}>
                <Text style={{ color: 'white' }}>{item.nom}</Text>
              </View>
            </Marker>
          ))
        ) : null}

        
        




      </MapView>

      {/* MenuBurger en overlay sur la carte */}
      <View style={styles.menuContainer}>
        <MenuBurger />
      </View>

      {/* Bouton pour switcher vers la liste des lieux */}
      <TouchableOpacity
        onPress={() => router.navigate('/Location')}
        style={styles.switchButton}
      >
        <Image
          source={iconByType.switchmap}
          style={styles.switchIcon}
        />
      </TouchableOpacity>
      <Navigation />
    </View>

  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 1,
  },
  userMarker: {
    width: 40,
    height: 40,
  },
  switchButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switchIcon: {
    width: 30,
    height: 30,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: 'white',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});