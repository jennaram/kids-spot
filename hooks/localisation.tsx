import * as Location from 'expo-location';
import { Platform, PermissionsAndroid, Alert, Linking } from 'react-native';

async function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    // Demander les permissions
    let permissionStatus: Location.PermissionResponse;
    if (Platform.OS === 'android') {
      const [hasPlayServices, foregroundStatus] = await Promise.all([
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
        return null;
      }
      permissionStatus = foregroundStatus;
    } else {
      permissionStatus = await Location.requestForegroundPermissionsAsync();
    }

    if (permissionStatus.status !== 'granted') {
      console.log('Permission de localisation refusée');
      return null;
    }

    // Obtenir la localisation actuelle
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    return { latitude: location.coords.latitude, longitude: location.coords.longitude };

  } catch (error: any) {
    console.error('Erreur lors de la récupération de la localisation:', error);
    Alert.alert(
      'Erreur de localisation',
      Platform.OS === 'android' && error.message?.includes('Google Play services')
        ? "Erreur des services Google - Vérifiez leur installation et redémarrez l'application."
        : 'Impossible de récupérer la localisation. Veuillez vérifier vos paramètres.'
    );
    return null;
  }
}

export default getUserLocation;