import React, { useState } from 'react';
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
import { router, useFocusEffect } from 'expo-router';
import { Navigation } from '@/components/NavBar/Navigation';
import PlacePopUp from '@/components/MainMap/PlacePopUp';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { useLocation } from '@/context/locate'; // Import du contexte
import styles from '@/app/style/MapScreen.style'; // Ton style actuel
import { SwitchMapButton } from '@/components/SwitchMapButton';

// Icônes personnalisées
const iconByType = {
  user: require('../assets/images/user-location.png'),
  switchmap: require('../assets/images/switchmap.png'),
  Culture: require('../assets/images/icon-culture2.png'),
  Restaurant: require('../assets/images/icon-food2.png'),
  Loisir: require('../assets/images/icon-loisirs2.png'),
};

export default function MapScreen() {
  // Utilisation du contexte Location
  const { userLocation, nearbyPlaces, error, refreshLocation } = useLocation();
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  // Mise à jour lorsque le composant reprend le focus
  useFocusEffect(
    React.useCallback(() => {
      refreshLocation(); // Recharge la localisation et les lieux à partir du contexte
      return () => {};
    }, [])
  );

  // Gestion des erreurs d'obtention de la localisation
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

  // Affichage de l'écran de chargement
  if (!userLocation) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Chargement de votre position...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Carte */}
      <MapView
        style={styles.map}
        region={{
          latitude: userLocation.latitude,
          longitude: userLocation.longitude,
          latitudeDelta: 0.005,
          longitudeDelta: 0.005,
        }}
        showsUserLocation={true}
        showsMyLocationButton={true}
        loadingEnabled={true}
        userLocationPriority="high"
        userLocationUpdateInterval={5000}
        provider={Platform.OS === 'android' ? 'google' : undefined}
      >
        {/* Marqueur pour l'utilisateur */}
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

        {/* Marqueurs pour les lieux */}
        {nearbyPlaces && nearbyPlaces.length > 0 && nearbyPlaces.map((item) => (
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
              <Image source={iconByType.Culture} style={styles.cultureMarker} resizeMode="contain" />
            ) : item.type[0].nom === 'Restaurant' ? (
              <Image source={iconByType.Restaurant} style={styles.foodMarker} resizeMode="contain" />
            ) : item.type[0].nom === 'Loisirs' ? (
              <Image source={iconByType.Loisir} style={styles.loisirsMarker} resizeMode="contain" />
            ) : (
              <View style={{ backgroundColor: 'blue', padding: 5, borderRadius: 10 }}>
                <Text style={{ color: 'white' }}>{item.nom}</Text>
              </View>
            )}
          </Marker>
        ))}
      </MapView>

      {/* Composant PopUp */}
      <PlacePopUp
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        place={selectedPlace}
        userLocation={userLocation}
        iconByType={iconByType}
      />

      {/* Burger Menu flottant */}
      <View style={styles.burgerMenuContainer}>
        <BurgerMenu />
      </View>

      {/* Bouton pour changer la carte */}
      <SwitchMapButton isMapView={true} />

      {/* Barre de navigation */}
      <Navigation />
    </View>
  );
};