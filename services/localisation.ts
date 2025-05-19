// Importation des modules nécessaires
import * as Location from 'expo-location';
import { Alert, Linking, Platform } from 'react-native';

// Fonction utilitaire pour obtenir la position avec un timeout
const getPositionWithTimeout = async (timeoutMs: number = 5000): Promise<Location.LocationObject> => {
  return Promise.race([
    // Demander la position actuelle
    Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced, // Précision moyenne pour équilibre vitesse/économie d'énergie
    }),
    // Si dépassement du délai, rejet de la promesse
    new Promise<Location.LocationObject>((_, reject) =>
      setTimeout(() => reject(new Error('Localisation trop longue')), timeoutMs)
    ),
  ]);
};

// Fonction principale pour récupérer la position de l'utilisateur
async function getUserLocation(): Promise<{ latitude: number; longitude: number } | null> {
  try {
    let permissionStatus: Location.PermissionResponse;

    if (Platform.OS === 'android') {
      // Sur Android, vérifier les services Google Play ET demander la permission de localisation
      const [hasPlayServices, foregroundStatus] = await Promise.all([
        Location.hasServicesEnabledAsync(),          // Google Play Services actifs ?
        Location.requestForegroundPermissionsAsync(), // Permission de localisation
      ]);

      if (!hasPlayServices) {
        // Si les services Google Play ne sont pas actifs, afficher une alerte
        Alert.alert(
          'Services Google requis',
          'Cette application nécessite Google Play Services pour la géolocalisation',
          [
            {
              text: 'Activer',
              onPress: () => Linking.openSettings(), // Ouvre les paramètres Android
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
      // Sur iOS, simplement demander la permission
      permissionStatus = await Location.requestForegroundPermissionsAsync();
    }

    // Si la permission est refusée
    if (permissionStatus.status !== 'granted') {
      //console.log('Permission de localisation refusée');
      return null;
    }

    // Essayer de récupérer la dernière position connue
    let location = await Location.getLastKnownPositionAsync({});

    // Si pas de position connue, essayer d'obtenir la position actuelle avec un timeout
    if (!location) {
      location = await getPositionWithTimeout(5000); // Timeout après 5 secondes
    }

    // Retourner l'objet contenant la latitude et longitude
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };

  } catch (error: any) {
    // Gestion des erreurs
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

// Export de la fonction pour l'utiliser ailleurs dans l'app
export default getUserLocation;