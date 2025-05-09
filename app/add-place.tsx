import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useAddPlaceOrEvent } from '@/hooks/place/useAddPlace';
import {
  View, Text, TextInput, ScrollView, TouchableOpacity,
  Image, Alert, SafeAreaView
} from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

// Composants
import { Navigation } from '@/components/NavBar/Navigation';
import { Title } from '@/components/Title';
import { FormInput } from './components/Form/InputField';
import SubmitButton from './components/Form/SubmitButton';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import FiltreButtons from '@/components/Filtres/FiltreButtons';
import { PhotoPickerButton } from '@/components/PhotoPickerButton';
import AgeBadges from '@/components/Lieux/AgeBadges';
import StarRating from '@/components/Notation/StarRating';
import { AvailableEquipments, EquipmentKeys, EquipmentType } from '@/components/Lieux/AvailableEquipments';
import GeoLocationInput from '@/components/Lieux/GeoLocationInput';

// Styles
import { colorButtonFirst } from './style/styles';
import styles from '@/app/style/add-place.styles';
import { useGeocodeAddress } from '@/hooks/location/useGeocodeAddress';

// Types
type PlaceType = 'restaurant' | 'culture' | 'leisure';
type LocationType = LatLng | null;

const AddPlaceScreen = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { submitPlaceOrEvent, loading, error, success, fieldErrors } = useAddPlaceOrEvent();

  const sendEmailNotification = async (placeData: any) => {
    try {
      console.log('Tentative d\'envoi d\'email pour:', placeData.nom);
      
      const response = await fetch('https://api.kidspot.fr/api/notifications/email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          subject: 'Nouveau lieu ajouté sur KidsSpot',
          to: 'kidsspottp@gmail.com',
          data: {
            placeName: placeData.nom,
            address: placeData.adresse,
            ville: placeData.ville
          }
        })
      });

      if (!response.ok) {
        throw new Error(`Erreur lors de l'envoi de l'email (${response.status})`);
      }

      console.log('Email envoyé avec succès');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  };

  const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>([]);
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [placeName, setPlaceName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<LocationType>(null);
  const [description, setDescription] = useState('');
  const [ageRanges, setAgeRanges] = useState<string[]>(['0-2']);
  const [rating, setRating] = useState(3);
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [codepostal, setCodepostal] = useState('');
  const [ville, setVille] = useState('');
  const [horaires, setHoraires] = useState('');
  const [equipments, setEquipments] = useState<EquipmentType>({
    strollerAccess: false,
    playArea: false,
    microwave: false,
    highChair: false,
    changingTable: false,
    parking: false,
  });

  const { geocode } = useGeocodeAddress();

  const placeIcons = useMemo(() => ({
    restaurant: require('@/assets/images/user-location-restaurant.png'),
    culture: require('@/assets/images/user-location-culture.png'),
    leisure: require('@/assets/images/user-location-loisir.png'),
  }), []);

  const ageRangeOptions = useMemo(() => ['0-2', '3-6', '7+'], []);
  const ratingOptions = useMemo(() => [1, 2, 3, 4, 5], []);

  const handleGetCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'Permission de localisation refusée');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      const [addressResult] = await Location.reverseGeocodeAsync({
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      });

      if (addressResult) {
        const street = addressResult.street || '';
        const city = addressResult.city || '';
        setAddress(`${street}${street && city ? ', ' : ''}${city}`);
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir la localisation actuelle');
    }
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!placeName || !address || !codepostal || !ville) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires (nom, adresse, code postal et ville)');
      return;
    }

    if (!token) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter un lieu');
      return;
    }

    // Construire l'adresse complète pour le géocodage
    const fullAddress = `${address.trim()}, ${codepostal.trim()} ${ville.trim()}, France`;
    console.log('Tentative de géocodage avec l\'adresse:', fullAddress);
    
    const coords = await geocode(fullAddress);

    if (!coords) {
      Alert.alert(
        'Erreur de géolocalisation',
        'Impossible de récupérer les coordonnées GPS de cette adresse. Vérifiez que l\'adresse est correcte et réessayez.',
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('Coordonnées GPS obtenues:', coords);

    const typeIdMap = {
      restaurant: 1,
      leisure: 2,
      culture: 3
    };

    const equipmentIdMap = {
      strollerAccess: 1,
      playArea: 2,
      microwave: 3,
      highChair: 4,
      changingTable: 5,
      parking: 6
    };

    const ageRangeIdMap = {
      '0-2': 1,
      '3-6': 2,
      '7+': 3
    };

    const activeEquipments = Object.entries(equipments)
      .filter(([_, isActive]) => isActive)
      .map(([key]) => equipmentIdMap[key as keyof typeof equipmentIdMap]);

    const ageRangeIds = ageRanges.map(age => ageRangeIdMap[age as keyof typeof ageRangeIdMap]);

    const newPlace = {
      nom: placeName,
      description: description,
      horaires: horaires,
      adresse: address,
      ville: ville,
      code_postal: codepostal,
      longitude: coords.lon,
      latitude: coords.lat,
      telephone: phoneNumber.trim(),
      site_web: website.trim(),
      id_type: typeIdMap[placeType],
      equipements: activeEquipments,
      tranches_age: ageRangeIds
    };

    console.log('Tentative d\'ajout du lieu avec les données:', newPlace);

    try {
      await submitPlaceOrEvent(newPlace, token);
      console.log('Réponse de submitPlaceOrEvent - success:', success, 'error:', error);
      
      if (error) {
        console.error('Erreurs par champ:', fieldErrors);
        let errorMessage = 'Une erreur est survenue lors de l\'ajout du lieu';
        if (Object.keys(fieldErrors).length > 0) {
          errorMessage += ':\n' + Object.entries(fieldErrors)
            .map(([field, msg]) => `${field}: ${msg}`)
            .join('\n');
        }
        Alert.alert('Erreur', errorMessage);
        return;
      }

      // try {
      //   await sendEmailNotification(newPlace);
      //   Alert.alert(
      //     'Succès',
      //     'Le lieu a été ajouté avec succès',
      //     [{ text: 'OK', onPress: () => router.push('/(tabs)/places') }]
      //   );
      // } catch (emailError) {
      //   console.error('Erreur lors de l\'envoi de l\'email de notification:', emailError);
      //   // Le lieu a été ajouté mais l'email a échoué
      //   Alert.alert(
      //     'Lieu ajouté - Erreur email',
      //     'Le lieu a été ajouté mais l\'email de notification n\'a pas pu être envoyé.',
      //     [{ text: 'OK', onPress: () => router.push('/(tabs)/places') }]
      //   );
      // }
    } catch (err) {
      console.error('Error submitting place:', err);
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du lieu');
    }
  }, [placeName, placeType, address, location, description, ageRanges, rating, equipments, website, phoneNumber, router, success]);

  useEffect(() => {
    if (error) {
      console.log(fieldErrors)
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du lieu');
    }
    if (success) {
      Alert.alert('Succès', 'Lieu ajouté avec succès')
    }
  }, [loading, error, success]);

  const toggleAgeRange = useCallback((age: string) => {
    setAgeRanges((prev) =>
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );
  }, []);

  const toggleEquipment = useCallback((key: EquipmentKeys) => {
    setEquipments(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const getTranslatedLabel = (key: string) => {
    return key === '0-2' ? '0-2 ans' :
      key === '3-6' ? '3-6 ans' :
        '7 ans et plus';
  };

  function setPhotoUri(uri: string): void {
    // Gérer la sélection de photo ici si nécessaire
  }

  return (
    <SafeAreaView style={styles.container}>
      <BurgerMenu />
      <Title text={'Ajouter un lieu'} />

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.label}>Nom du lieu</Text>
          <FormInput
            label=""
            value={placeName}
            onChangeText={setPlaceName}
            placeholder="Entrez le nom du lieu"
          />
          <PhotoPickerButton onPhotoSelected={(uri) => setPhotoUri(uri)} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type de lieu</Text>
          <FiltreButtons
            selectedTypeIds={selectedTypeIds}
            onPress={(id) => {
              setSelectedTypeIds([id]); // Un seul ID sélectionné à la fois
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Adresse</Text>
          <GeoLocationInput
            address={address}
            onAddressChange={setAddress}
            onGetLocation={handleGetCurrentLocation}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Code Postal</Text>
          <FormInput
            label=""
            value={codepostal}
            onChangeText={setCodepostal}
            placeholder="75000"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Ville</Text>
          <FormInput
            label=""
            value={ville}
            onChangeText={setVille}
            placeholder="Paris"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Site web (optionnel)</Text>
          <FormInput
            label=""
            value={website}
            onChangeText={setWebsite}
            placeholder="https://www.exemple.com"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Téléphone (optionnel)</Text>
          <FormInput
            label=""
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="01 23 45 67 89"
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Horaires</Text>
          <FormInput
            label=""
            value={horaires}
            onChangeText={setHoraires}
            placeholder="10h-18h"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.multilineInput}
            placeholder="Entrez une description"
            value={description}
            onChangeText={setDescription}
            multiline
          />
        </View>

        <View style={styles.section}>
          <AvailableEquipments
            equipments={equipments}
            toggleEquipment={toggleEquipment}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Tranche d'âge</Text>
          <View style={styles.ageBadgesContainer}>
            {ageRangeOptions.map((age) => (
              <TouchableOpacity
                key={age}
                onPress={() => toggleAgeRange(age)}
              >
                <AgeBadges
                  tranchesAge={[getTranslatedLabel(age)]}
                  badgeColor={ageRanges.includes(age) ? colorButtonFirst : '#ddd'}
                  containerStyle={styles.ageBadgeContainer}
                  badgeStyle={styles.ageBadge}
                  textStyle={styles.ageBadgeText}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {location && (
          <View style={styles.section}>
            <Text style={styles.label}>Localisation</Text>
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                initialRegion={{
                  ...location,
                  latitudeDelta: 0.01,
                  longitudeDelta: 0.01,
                }}
              >
                <Marker coordinate={location}>
                  <Image
                    source={placeIcons[placeType]}
                    style={styles.markerImage}
                  />
                </Marker>
              </MapView>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <StarRating
            rating={rating}
            setRating={setRating}
            label="Note (sur 5)"
            containerStyle={styles.ratingContainer}
          />
        </View>

        <SubmitButton title="Ajouter le lieu" onPress={handleSubmit} />
        <View style={styles.bottomSpacer} />
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
};

export default AddPlaceScreen;