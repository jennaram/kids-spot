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
import { router, useFocusEffect } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import Layout from './components/LayoutNav';
import fetchNearbyPlaces from '@/api/fetchNearbyPlaces';
import getUserLocation from '@/services/localisation';
import { Navigation } from '@/components/NavBar/Navigation';


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


 const navigateToDetails = (place: { id: string }) => {
   // Ferme la popup
   setShowPopup(false);
  
   // Navigation vers la page details_lieu avec les données du lieu
   router.push({
     pathname: '/details_lieu',
     params: { id: place.id }
   });
 };


 // Calculer la distance entre deux coordonnées en km
 const calculateDistance = (lat1, lon1, lat2, lon2) => {
   const R = 6371; // Rayon de la terre en km
   const dLat = deg2rad(lat2 - lat1);
   const dLon = deg2rad(lon2 - lon1);
   const a =
     Math.sin(dLat/2) * Math.sin(dLat/2) +
     Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
     Math.sin(dLon/2) * Math.sin(dLon/2);
   const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
   const distance = R * c; // Distance en km
   return distance.toFixed(1); // Arrondi à une décimale
 };
  const deg2rad = (deg) => {
   return deg * (Math.PI/180);
 };


 // Fonction pour obtenir le style de fond correspondant au type de lieu
 const getIconBackgroundStyle = (typeName) => {
   switch(typeName) {
     case 'Culture':
       return styles.cultureBackground;
     case 'Restaurant':
       return styles.restaurantBackground;
     case 'Loisir':
       return styles.loisirBackground;
     default:
       return {};
   }
 };


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


     {showPopup && selectedPlace && userLocation && (
       <TouchableOpacity
         style={styles.popupContainer}
         activeOpacity={0.95}
         onPress={() => navigateToDetails(selectedPlace)}
       >
         <TouchableOpacity
           style={styles.closeButton}
           onPress={(e) => {
             e.stopPropagation(); // Empêche la propagation du clic à la popup parente
             setShowPopup(false);
           }}
         >
           <Text style={styles.closeButtonText}>×</Text>
         </TouchableOpacity>
        
         <View style={styles.headerContainer}>
           <View style={[
             styles.iconContainer,
             getIconBackgroundStyle(selectedPlace.type[0].nom)
           ]}>
             <Image
               source={iconByType[selectedPlace.type[0].nom]}
               style={styles.popupIcon}
               resizeMode="contain"
             />
           </View>
           <Text style={styles.popupTitle}>{selectedPlace.nom}</Text>
         </View>
        
         <View style={styles.infoContainer}>
           <Text style={styles.infoText}>{selectedPlace.adresse.ville}</Text>
           <Text style={styles.infoText}>
             {calculateDistance(
               userLocation.latitude,
               userLocation.longitude,
               selectedPlace.position.latitude,
               selectedPlace.position.longitude
             )} km
           </Text>
           <Text style={styles.infoText}>{selectedPlace.horaires}</Text>
         </View>
        
         <View style={styles.seeMoreContainer}>
           <Text style={styles.seeMoreText}>Voir plus de détails</Text>
           <Text style={styles.arrowRight}>→</Text>
         </View>
       </TouchableOpacity>
     )}


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
   zIndex: 100,
 },
 userMarker: {
   width: 40,
   height: 40,
 },
 cultureMarker: {
   width: 40,
   height: 40,
   backgroundColor: '#ff9770',
   borderRadius: 25,
   elevation: 10,
 },
 foodMarker: {
   width: 40,
   height: 40,
   backgroundColor: '#95d5b2',
   borderRadius: 25,
   elevation: 10,
 },
 loisirsMarker: {
   width: 40,
   height: 40,
   backgroundColor: '#8ecae6',
   borderRadius: 25,
   elevation: 10,
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
 popupContainer: {
   position: 'absolute',
   bottom: 170, // Au-dessus de la navbar
   left: 20,
   right: 20,
   backgroundColor: 'white',
   borderRadius: 15,
   padding: 15,
   shadowColor: '#000',
   shadowOffset: {
     width: 0,
     height: 2,
   },
   shadowOpacity: 0.25,
   shadowRadius: 3.84,
   elevation: 5,
 },
 headerContainer: {
   flexDirection: 'row',
   alignItems: 'center',
   marginBottom: 12,
 },
 iconContainer: {
   width: 40,
   height: 40,
   borderRadius: 20,
   justifyContent: 'center',
   alignItems: 'center',
   marginRight: 10,
 },
 popupIcon: {
   width: 24,
   height: 24,
 },
 cultureBackground: {
   backgroundColor: '#ff9770',
 },
 restaurantBackground: {
   backgroundColor: '#95d5b2',
 },
 loisirBackground: {
   backgroundColor: '#8ecae6',
 },
 popupTitle: {
   fontSize: 18,
   fontWeight: 'bold',
   flex: 1,
 },
 infoContainer: {
   marginBottom: 10,
 },
 infoText: {
   fontSize: 14,
   color: '#555',
   marginBottom: 5,
 },
 closeButton: {
   position: 'absolute',
   top: 5,
   right: 10,
   padding: 5,
   zIndex: 10, // Assure que le bouton est au-dessus et cliquable
 },
 closeButtonText: {
   fontSize: 20,
   color: '#333',
 },
 seeMoreContainer: {
   flexDirection: 'row',
   justifyContent: 'flex-end',
   alignItems: 'center',
   marginTop: 10,
   paddingTop: 5,
   borderTopWidth: 1,
   borderTopColor: '#eee',
 },
 seeMoreText: {
   color: '#000', // Changé en noir
   fontWeight: '600',
 },
 arrowRight: {
   fontSize: 16,
   color: '#000', // Changé en noir
   marginLeft: 5,
 }
});



