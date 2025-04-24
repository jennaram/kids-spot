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
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useFocusEffect, useRouter } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import Layout from './components/LayoutNav';
import MenuBurger from './components/menuburger';

// Icônes personnalisées
const iconByType = {
  user: require('../assets/images/user-location.png'),
  switchmap: require('../assets/images/switchmap.png'),
};

export default function MapScreen() {
  const router = useRouter();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [userLocation, setUserLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [locationSubscription, setLocationSubscription] =
    useState<Location.LocationSubscription | null>(null);
  const [menuVisible, setMenuVisible] = useState(false);

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
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        {Platform.OS === 'android' && (
          <TouchableOpacity
            style={styles.button}
            onPress={() => Linking.openURL('market://details?id=com.google.android.gms')}
          >
            <Text style={styles.buttonText}>Vérifier Google Play Services</Text>
          </TouchableOpacity>
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
      </MapView>

      {/* MenuBurger en overlay sur la carte */}
      <View style={styles.menuContainer}>
        <MenuBurger />
      </View>

      {/* Bouton pour switcher vers la liste des lieux */}
      <TouchableOpacity
        onPress={() => router.push('/listelieux')}
        style={styles.switchButton}
      >
        <Image
          source={iconByType.switchmap}
          style={styles.switchIcon}
        />
      </TouchableOpacity>

      {/* Barre de navigation en bas */}
      <Layout
        activeTab="map"
        onMapPress={() => navigation.navigate('Map')}
        onCalendarPress={() => navigation.navigate('Calendar')}
        onAddPress={() => navigation.navigate('Add')}
        onFavoritePress={() => navigation.navigate('Favorites')}
      />
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