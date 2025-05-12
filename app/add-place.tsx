import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useAddPlaceOrEvent } from '@/hooks/place/useAddPlace';
import {
  View, Text, TextInput, ScrollView, 
  Image, Alert, SafeAreaView, KeyboardAvoidingView, Platform
} from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

// Composants personnalisés
import { Navigation } from '@/components/NavBar/Navigation';
import { Title } from '@/components/Title';
import { FormInput } from './components/Form/InputField';
import SubmitButton from './components/Form/SubmitButton';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { PhotoPickerButton } from '@/components/PhotoPickerButton';
import StarRating from '@/components/Notation/StarRating';
import { AvailableEquipments, EquipmentKeys, EquipmentType } from '@/components/Lieux/AvailableEquipments';
import GeoLocationInput from '@/components/Lieux/GeoLocationInput';
import SelectionBadges from '@/components/SelectionBadges';

// Styles et hooks personnalisés
import styles from '@/app/style/add-place.styles';
import { useGeocodeAddress } from '@/hooks/location/useGeocodeAddress';
import { useSendMail } from '@/hooks/place/useSendMail';

// Types
type PlaceType = 'restaurant' | 'culture' | 'leisure';
type LocationType = LatLng | null;

const AddPlaceScreen = () => {
  // Hooks de navigation et authentification
  const router = useRouter();
  const { token } = useAuth();
  const { submitPlaceOrEvent, loading, error, success, fieldErrors } = useAddPlaceOrEvent();
  const { submitMail } = useSendMail();
  const { geocode } = useGeocodeAddress();

  // États du formulaire
  const [placeName, setPlaceName] = useState('');
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
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
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [equipments, setEquipments] = useState<EquipmentType>({
    strollerAccess: false,
    playArea: false,
    microwave: false,
    highChair: false,
    changingTable: false,
    parking: false,
  });

  // Options constantes
  const placeTypeOptions = useMemo(() => ['restaurant', 'culture', 'leisure'], []);
  const ageRangeOptions = useMemo(() => ['0-2', '3-6', '7+'], []);

  // Gestion de la localisation
  const handleGetCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'Permission de localisation refusée');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const newLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
      };
      setLocation(newLocation);

      const [addressResult] = await Location.reverseGeocodeAsync(newLocation);
      if (addressResult) {
        const street = addressResult.street || '';
        const city = addressResult.city || '';
        setAddress(`${street}${street && city ? ', ' : ''}${city}`);
        setVille(addressResult.city || '');
        setCodepostal(addressResult.postalCode || '');
      }
    } catch (error) {
      console.error('Erreur de géolocalisation:', error);
      Alert.alert('Erreur', 'Impossible d\'obtenir la localisation actuelle');
    }
  }, []);

  // Gestion de la sélection des équipements
  const toggleEquipment = useCallback((key: EquipmentKeys) => {
    setEquipments(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Soumission du formulaire
  const handleSubmit = useCallback(async () => {
    // Validation des champs obligatoires
    if (!placeName || !address || !codepostal || !ville) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    if (!token) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter un lieu');
      return;
    }

    // Géocodage de l'adresse
    const fullAddress = `${address.trim()}, ${codepostal.trim()} ${ville.trim()}, France`;
    const coords = await geocode(fullAddress);

    if (!coords) {
      Alert.alert(
        'Erreur de géolocalisation',
        'Impossible de récupérer les coordonnées GPS de cette adresse.',
        [{ text: 'OK' }]
      );
      return;
    }

    // Mapping des identifiants
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

    // Préparation des données
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

    try {
      // Soumettre le lieu
      await submitPlaceOrEvent(newPlace, token);

      // Envoi d'un email de confirmation
      const sujet = "Nouveau lieu ajouté";
      const contenueHTML = `
        <h1>Nouveau lieu ajouté</h1>
        <p><strong>${placeName}</strong> a été ajouté avec succès.</p>
        <p>Ville : ${ville}</p>
        <p>Adresse : ${address}</p>
      `;
      await submitMail(sujet, contenueHTML, token);

      // Redirection après succès
      Alert.alert(
        'Succès',
        'Le lieu a été ajouté avec succès',
        [{ text: 'OK', onPress: () => router.push('accueil') }]
      );
    } catch (err) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l\'ajout du lieu');
    }
  }, [
    placeName, address, codepostal, ville, description, 
    horaires, placeType, ageRanges, phoneNumber, 
    website, equipments, token, router, submitPlaceOrEvent, submitMail, geocode
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
        style={styles.container}
      >
        <BurgerMenu />
        <Title text={'Ajouter un lieu'} />

        <ScrollView 
          style={styles.scrollView}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Nom du lieu */}
          <View style={styles.section}>
            <Text style={styles.label}>Nom du lieu</Text>
            <FormInput
              value={placeName}
              onChangeText={setPlaceName}
              placeholder="Entrez le nom du lieu" label={''}            />
            <PhotoPickerButton 
              onPhotoSelected={(uri) => setPhotoUri(uri)} 
            />
          </View>

          {/* Type de lieu */}
          <SelectionBadges
            label="Type de lieu"
            options={placeTypeOptions}
            selectedOptions={[placeType]}
            onToggle={(type) => setPlaceType(type as PlaceType)}
            multiSelect={false}
          />

          {/* Adresse */}
          <View style={styles.section}>
            <Text style={styles.label}>Adresse</Text>
            <GeoLocationInput
              address={address}
              onAddressChange={setAddress}
              onGetLocation={handleGetCurrentLocation}
            />
          </View>

          {/* Code Postal */}
          <View style={styles.section}>
            <Text style={styles.label}>Code Postal</Text>
            <FormInput
              value={codepostal}
              onChangeText={setCodepostal}
              placeholder="75000"
              keyboardType="numeric" label={''}            />
          </View>

          {/* Ville */}
          <View style={styles.section}>
            <Text style={styles.label}>Ville</Text>
            <FormInput
              value={ville}
              onChangeText={setVille}
              placeholder="Paris" label={''}            />
          </View>

          {/* Tranches d'âge */}
          <SelectionBadges
            label="Tranche d'âge"
            options={ageRangeOptions}
            selectedOptions={ageRanges}
            onToggle={(age) => {
              setAgeRanges(prev => 
                prev.includes(age) 
                  ? prev.filter(a => a !== age) 
                  : [...prev, age]
              );
            }}
            multiSelect={true}
          />

          {/* Autres champs du formulaire */}
          <View style={styles.section}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={styles.multilineInput}
              placeholder="Entrez une description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
            />
          </View>

          {/* Équipements */}
          <AvailableEquipments
            equipments={equipments}
            toggleEquipment={toggleEquipment}
          />

          {/* Notation */}
          <StarRating
            rating={rating}
            setRating={setRating}
            label="Note (sur 5)"
          />

          {/* Bouton de soumission */}
          <SubmitButton 
            title="Ajouter le lieu" 
            onPress={handleSubmit} 
            disabled={loading}
          />

          {/* Espace en bas pour éviter de cacher le contenu */}
          <View style={styles.bottomSpacer} />
        </ScrollView>

        <Navigation />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default AddPlaceScreen;