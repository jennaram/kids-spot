import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  Text,
  Platform,
  Linking,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { router, useFocusEffect } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import fetchNearbyPlaces from '@/api/fetchNearbyPlaces';
import getUserLocation from '@/services/localisation';
import { Navigation } from '@/components/NavBar/Navigation';
import PlacePopUp from '@/components/MainMap/PlacePopUp'; 
import styles from '@/app/style/MapScreen.style';


// Icônes personnalisées
const iconByType = {
  user: require('../assets/images/user-location.png'),
  switchmap: require('../assets/images/switchmap.png'),
  Culture: require('../assets/images/icon-culture2.png'),
  Restaurant: require('../assets/images/icon-food2.png'),
  Loisir: require('../assets/images/icon-loisirs2.png'),
};

export default function MapScreen() {
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<any[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  const loadNearbyPlaces = async (lat: number, lng: number) => {
    const placesData = await fetchNearbyPlaces(lat, lng);
    if (placesData && placesData.status === 'success' && placesData.data) {
      setNearbyPlaces(placesData.data);
    } else {
      console.error('Erreur lors de la récupération des lieux à proximité');
    }
  };

  const fetchLocationAndPlaces = async () => {
    const location = await getUserLocation();
    if (location) {
      setUserLocation(location);
      setError(null);
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
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
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
      <View style={styles.loadingContainer}>
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
              onPress={() => {
                setSelectedPlace(item);
                setShowPopup(true);
              }}
              tracksInfoWindowChanges={false}
            >
              {item.type[0].nom === 'Culture' ? (
                <Image
                  source={iconByType.Culture}
                  style={styles.cultureMarker}
                  resizeMode="contain"
                />
              ) : item.type[0].nom === 'Restaurant' ? (
                <Image
                  source={iconByType.Restaurant}
                  style={styles.foodMarker}
                  resizeMode="contain"
                />
              ) : item.type[0].nom === 'Loisir' ? (
                <Image
                  source={iconByType.Loisir}
                  style={styles.loisirsMarker}
                  resizeMode="contain"
                />
              ) : (
                <View style={{ backgroundColor: 'blue', padding: 5, borderRadius: 10 }}>
                  <Text style={{ color: 'white' }}>{item.nom}</Text>
                </View>
              )}
            </Marker>
          ))
        ) : null}
      </MapView>

      {/* Utilisation du nouveau composant PlacePopUp */}
      <PlacePopUp
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        place={selectedPlace}
        userLocation={userLocation}
        iconByType={iconByType}
      />

      <View style={styles.menuContainer}>
        {/* <MenuBurger /> */}
      </View>

      <TouchableOpacity
        onPress={() => router.push('/Location')}
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
};

