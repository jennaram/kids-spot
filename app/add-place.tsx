import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useAddPlaceOrEvent } from '@/hooks/place/useAddPlace';
import {
  View, Text, Switch, TextInput, ScrollView, TouchableOpacity,
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
import { useSendMail } from '@/hooks/place/useSendMail';

// Types
type PlaceType = 'restaurant' | 'culture' | 'leisure';
type LocationType = LatLng | null;

const AddPlaceScreen = () => {
  const router = useRouter();
  const { token } = useAuth();
  const { submitPlaceOrEvent, loading, error, success, fieldErrors } = useAddPlaceOrEvent();
  const { submitMail, loading: loadinMail, error: errorMail, success: successMail } = useSendMail();

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
  const [isEvent, setIsEvent] = useState(false);
  const [expiration, setExpiration] = useState("");
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const formatDate = (date: string | number | Date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `<span class="math-inline">\{day\}/</span>{month}/${year}`;
  };
  const [equipments, setEquipments] = useState<EquipmentType>({
    strollerAccess: false,
    playArea: false,
    microwave: false,
    highChair: false,
    changingTable: false,
    parking: false,
  });

  const { geocode } = useGeocodeAddress();

  const handleExpirationChange = (text: string) => {
    const onlyNumbers = text.replace(/\D/g, "");
    if (onlyNumbers.length <= 4) {
      setExpiration(onlyNumbers);
    }
  };

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
        const fullAddress = `${street}${street && city ? ', ' : ''}${city || 'Paris'}`;
        setAddress(fullAddress);
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

    if (selectedTypeIds.length === 0) {
      Alert.alert('Erreur', 'Veuillez sélectionner au moins un type de lieu : Restaurant, Loisirs ou Culture');
      return;
    }

    if (!token) {
      Alert.alert('Erreur', 'Vous devez être connecté pour ajouter un lieu');
      return;
    }

    // Construire l'adresse complète pour le géocodage
    const fullAddress = `${address.trim()}, ${codepostal.trim()} ${ville.trim()}, France`;
    //console.log('Tentative de géocodage avec l\'adresse:', fullAddress);

    const coords = await geocode(fullAddress);

    if (!coords) {
      Alert.alert(
        'Erreur de géolocalisation',
        'Impossible de récupérer les coordonnées GPS de cette adresse. Vérifiez que l\'adresse est correcte et réessayez.',
        [{ text: 'OK' }]
      );
      return;
    }

    //console.log('Coordonnées GPS obtenues:', coords);

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
      tranches_age: ageRangeIds,
      date_debut: isEvent ? startDate : null,
      date_fin: isEvent ? endDate : null,
    };

    //console.log('Tentative d\'ajout du lieu avec les données:', newPlace);
    await submitPlaceOrEvent(newPlace, token);

  }, [placeName, placeType, address, location, description, ageRanges, rating, equipments, website, phoneNumber, router, success, token, submitPlaceOrEvent, geocode, submitMail, fieldErrors, ville, codepostal, horaires, isEvent, startDate, endDate]);

  useEffect(() => {
    if (success) {
      // Envoi de mail de confirmation
      const sujet = "Nouveau lieu ajouté";
      const contenueHTML = `
        <h1>Nouveau lieu ajouté</h1>
        <p><strong>${placeName}</strong> a été ajouté avec succès par un utilisateur.</p>
        <p>Ville : ${ville}</p>
        <p>Adresse : ${address}</p>`;
      submitMail(sujet, contenueHTML, token ?? '');

      Alert.alert(
        'Succès',
        'Le lieu a été ajouté avec succès',
        [{ text: 'OK', onPress: () => router.push('main') }]
      );
}
  if (error)
    Alert.alert(
      'Erreur',
      'Une erreur est survenue lors de l\'ajout du lieu. Veuillez réessayer.',
      [{ text: 'OK' }]  
    );
  }, [loading, error, success, fieldErrors]);









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

const formatEventDate = (text: string, setter: (val: string) => void) => {
  const onlyNumbers = text.replace(/\D/g, "").slice(0, 8); // max 8 chiffres pour JJMMAAAA

  let formatted = "";
  if (onlyNumbers.length <= 2) {
    formatted = onlyNumbers;
  } else if (onlyNumbers.length <= 4) {
    formatted = `${onlyNumbers.slice(0, 2)}/${onlyNumbers.slice(2)}`;
  } else {
    formatted = `${onlyNumbers.slice(0, 2)}/${onlyNumbers.slice(2, 4)}/${onlyNumbers.slice(4)}`;
  }

  setter(formatted);
};

const isStartBeforeEnd = (start: string, end: string) => {
  const [startDay, startMonth, startYear] = start.split("/").map(Number);
  const [endDay, endMonth, endYear] = end.split("/").map(Number);

  const startDateObj = new Date(startYear, startMonth - 1, startDay);
  const endDateObj = new Date(endYear, endMonth - 1, endDay);

  return startDateObj < endDateObj;
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
            const type = id === 1 ? 'restaurant' : id === 2 ? 'leisure' : 'culture';
            setPlaceType(type);
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
          placeholder="75000"
          onChangeText={(text) => {
            const onlyNumbers = text.replace(/[^0-9]/g, '');
            setCodepostal(onlyNumbers.slice(0, 5));
          }}
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
          placeholder="01 23 45 67 89"
          keyboardType="phone-pad"
          onChangeText={(text) => {
            const onlyNumbers = text.replace(/[^0-9]/g, '');
            setPhoneNumber(onlyNumbers.slice(0, 10));
          }}
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
        <Text style={styles.label}>Est-ce un événement ?</Text>
        <Switch value={isEvent} onValueChange={setIsEvent} />
      </View>

      {isEvent && (
        <>
          <View style={styles.section}>
            <Text style={styles.label}>Date de début de l’événement</Text>
            <FormInput
              label=""
              value={startDate}
              placeholder="JJ/MM/AAAA"
              onChangeText={(text) => {
                formatEventDate(text, setStartDate);
                if (text.length === 10 && endDate.length === 10) {
                  if (!isStartBeforeEnd(text, endDate)) {
                    alert("La date de début doit être antérieure à la date de fin.");
                  }
                }
              }}

            />
          </View>

          <View style={styles.section}>
            <Text style={styles.label}>Date de fin de l’événement</Text>
            <FormInput
              label=""
              value={endDate}
              placeholder="JJ/MM/AAAA"
              onChangeText={(text) => {
                formatEventDate(text, setEndDate);
                if (startDate.length === 10 && text.length === 10) {
                  if (!isStartBeforeEnd(startDate, text)) {
                    alert("La date de début doit être antérieure à la date de fin.");
                  }
                }
              }}

            />
          </View>
        </>
      )}



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