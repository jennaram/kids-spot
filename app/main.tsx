import React, { useState } from 'react';
import {
  View,
  Image,
  Text,
  Platform,
  Linking,
  TouchableOpacity,
  Button,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { router, useFocusEffect } from 'expo-router';
import { Navigation } from '@/components/NavBar/Navigation';
import PlacePopUp from '@/components/MainMap/PlacePopUp';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { useLocation } from '@/context/locate';
import styles from '@/app/style/MapScreen.style';
import SwitchMapButton from '@/components/SwitchMapButton';

const iconByType = {
  user: require('../assets/images/user-location.png'),
  Culture: require('../assets/images/icon-culture2.png'),
  Restaurant: require('../assets/images/icon-food2.png'),
  Loisir: require('../assets/images/icon-loisirs2.png'),
};

export default function MapScreen() {
  const { userLocation, nearbyPlaces, error, refreshLocation } = useLocation();
  const [selectedPlace, setSelectedPlace] = useState<any | null>(null);
  const [showPopup, setShowPopup] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      refreshLocation();
      return () => {};
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
    return <View style={styles.loadingContainer}><Text>Chargement...</Text></View>;
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
        showsUserLocation={true}
        provider={Platform.OS === 'android' ? 'google' : undefined}
      >
        <Marker coordinate={userLocation}>
          <Image source={iconByType.user} style={styles.userMarker} />
        </Marker>

        {nearbyPlaces?.map((item: { id: string; position: { latitude: number; longitude: number }; type: { nom: keyof typeof iconByType }[] }) => (
          <Marker
            key={item.id}
            coordinate={item.position}
            onPress={() => {
              setSelectedPlace(item);
              setShowPopup(true);
            }}
          >
            <Image 
              source={iconByType[item.type[0].nom]} 
              style={styles[`${item.type[0].nom.toLowerCase()}Marker` as keyof typeof styles]}
            />
          </Marker>
        ))}
      </MapView>

      <PlacePopUp
        visible={showPopup}
        onClose={() => setShowPopup(false)}
        place={selectedPlace} userLocation={null} iconByType={{}}      />

      <View style={styles.burgerMenuContainer}>
        <BurgerMenu />
      </View>

      
      <SwitchMapButton isMapView={true} />
      <Navigation />
    </View>
  );
}