import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useAddPlaceOrEvent } from '@/hooks/place/useAddPlace';
import {
  View, Text, Switch, TextInput, ScrollView, TouchableOpacity,
  Image, Alert, Modal, ActivityIndicator, Platform,
  StyleSheet
} from 'react-native';
import MapView, { Marker, LatLng } from 'react-native-maps';
import * as Location from 'expo-location';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { SafeAreaView } from "react-native-safe-area-context";

// Composants
import { Navigation } from '@/components/NavBar/Navigation';
import { Title } from '@/components/Title';
import { FormInput } from './components/Form/InputField';
import SubmitButton from './components/Form/SubmitButton';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import FiltreButtons from '@/components/Filtres/FiltreButtons';
import { PhotoPickerButton } from '@/components/PhotoPickerButton';
import AgeBadges from '@/components/Lieux/AgeBadges';
import { AvailableEquipments, EquipmentKeys, EquipmentType } from '@/components/Lieux/AvailableEquipments';
import GeoLocationInput from '@/components/Lieux/GeoLocationInput';

// Styles
import { colorButtonFirst } from './style/styles';
import styles from '@/app/style/add-place.styles';


import { useGeocodeAddress } from '@/hooks/location/useGeocodeAddress';
import { useSendMail } from '@/hooks/place/useSendMail';
import { useLocation } from '@/context/locate/LocationContext';

// Types
import { AddPlaceOrEventPayload } from '@/Types/place';
import { useReadPlace } from '@/hooks/place/useReadPlace';
import { IMAGE_BASE_URL } from '@/api/apiConfig';
import { useEditPlaceOrEvent } from '@/hooks/place/useEditPlace';
import { Row } from '@/components/Row';
import BackButton from './components/BackButton';
import { Logo } from '@/components/Logo';

type PlaceType = 'restaurant' | 'culture' | 'leisure';
type LocationType = LatLng | null;

const AddPlaceScreen = () => {
  const router = useRouter();
  const { token, grade } = useAuth();
  const params = useLocalSearchParams() as { id: string };
  const lieuId = Number(params.id?.toString() || null);
  const { place, loading: loadingRead, error: errorRead } = useReadPlace(lieuId);


  const [image, setImage] = useState<string>();
  const [cloudImageUrl, setCloudImageUrl] = useState<string>();

  const { submitPlaceOrEvent, loading: loadingSubmit, error, success: successSubmit, fieldErrors, id } = useAddPlaceOrEvent();

  const { updatePlaceOrEvent, error: errorEdit, success: successEdit, fieldErrors: fieldErrorsEdit } = useEditPlaceOrEvent();

  const { submitMail, loading: loadingMail, error: errorMail, success: successMail } = useSendMail();
  const [uploading, setUploading] = useState(false);
  const loading = loadingSubmit || loadingMail || uploading;
  const success = successSubmit && successMail && cloudImageUrl;
  const { refreshLocation } = useLocation();

  const { geocode } = useGeocodeAddress();

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
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [tempStartDate, setTempStartDate] = useState(new Date());
  const [tempEndDate, setTempEndDate] = useState(new Date());
  const [equipments, setEquipments] = useState<EquipmentType>({
    strollerAccess: false,
    playArea: false,
    microwave: false,
    highChair: false,
    changingTable: false,
    parking: false,
  });

  // Style du DateTimePicker pour iOS
  const datePickerIosStyles = {
    textColor: '#000', // Texte noir pour meilleure visibilité
    backgroundColor: '#f8f8f8', // Fond légèrement grisé pour faire ressortir les bordures
    accentColor: colorButtonFirst, // Utilisation de la couleur primaire de l'application
  };

  const placeIcons = useMemo(() => ({
    restaurant: require('@/assets/images/user-location-restaurant.png'),
    culture: require('@/assets/images/user-location-culture.png'),
    leisure: require('@/assets/images/user-location-loisir.png'),
  }), []);

  const ageRangeOptions = useMemo(() => ['0-2', '3-6', '7+'], []);

  const handleGetCurrentLocation = useCallback(async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'Permission de localisation refusée');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});
      const { latitude, longitude } = currentLocation.coords;
      setLocation({ latitude, longitude });

      const [addressResult] = await Location.reverseGeocodeAsync({ latitude, longitude });

      if (addressResult) {
        setAddress(`${addressResult.streetNumber} ${addressResult.street}` || '');
        setVille(addressResult.city || '');
        setCodepostal(addressResult.postalCode || '');
      }
    } catch (error) {
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

    if (placeName.length > 35) {
      Alert.alert('Erreur', 'Le nom du lieu ne peut pas dépasser 35 caractères');
      return;
    }

    if (isEvent && (!startDate || !endDate)) {
      Alert.alert('Erreur', 'Veuillez sélectionner les dates de début et de fin pour l\'événement');
      return;
    }

    const fullAddress = `${address.trim()}, ${codepostal.trim()}, France`;
    const coords = await geocode(fullAddress);

    if (!coords) {
      Alert.alert(
        'Erreur de géolocalisation',
        'Impossible de récupérer les coordonnées GPS de cette adresse. Vérifiez que l\'adresse est correcte et réessayez.',
        [{ text: 'OK' }]
      );
      return;
    }

    const typeIdMap: Record<PlaceType, number> = { restaurant: 1, leisure: 2, culture: 3 };
    const equipmentIdMap: Record<EquipmentKeys, number> = {
      strollerAccess: 1, playArea: 2, microwave: 3,
      highChair: 4, changingTable: 5, parking: 6
    };
    const ageRangeIdMap: Record<string, number> = { '0-2': 1, '3-6': 2, '7+': 3 };

    const equipements: number[] = Object.keys(equipments)
      .filter(key => equipments[key as EquipmentKeys])
      .map(key => equipmentIdMap[key as EquipmentKeys]);

    const tranches_age: number[] = ageRanges.map(age => ageRangeIdMap[age]);

    const newPlace: AddPlaceOrEventPayload = {
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
      equipements: equipements,
      tranches_age: tranches_age,
      ...(isEvent && { date_debut: startDate, date_fin: endDate }),
    };

    await submitPlaceOrEvent(newPlace, token);

  }, [placeName, placeType, address, description, ageRanges, equipments, website, phoneNumber, ville, codepostal, horaires, isEvent, startDate, endDate, token, submitPlaceOrEvent, geocode]);

  useEffect(() => {
    if (successSubmit) {
      const sujet = "Nouveau lieu ajouté";
      const contenueHTML = `
        <h1>Nouveau lieu ajouté</h1>
        <p><strong>${placeName}</strong> a été ajouté avec succès par un utilisateur.</p>
        <p>Ville : ${ville}</p>
        <p>Adresse : ${address}</p>`;
      submitMail(sujet, contenueHTML, token ?? '');
    }
    if (error)
      if (fieldErrors) {
        // Formater et afficher les erreurs de validation pour chaque champ
        const errorMessages = Object.entries(fieldErrors)
          .map(([field, message]) => `${field} : ${message}`)
          .join('\n');

        Alert.alert('Erreur(s) de validation', errorMessages);
      }
  }, [error, successSubmit]);

  useEffect(() => {
    if (id && image && !cloudImageUrl) {
      uploadImageToCloudinary(image, id);
    }
    if (id && !image) {
      setCloudImageUrl('rien');
    }
  }, [id]);

  useEffect(() => {
    if (success) {
      refreshLocation();
      Alert.alert(
        'Succès',
        'Le lieu a été ajouté avec succès',
        [{ text: 'OK', onPress: () => router.push('main') }]
      );
    }
  }, [success]);

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

  const formatDateForDisplay = (dateString: string) => {
    if (!dateString) return '';
    const [day, month, year] = dateString.split('/');
    return `${day}/${month}/${year}`;
  };

  const formatDateForAPI = (date: Date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  // Fonctions modifiées pour gérer le DateTimePicker
  const handleStartDateChange = (event: any, selectedDate?: Date) => {
    // Sur iOS, on ne ferme pas automatiquement le picker
    if (Platform.OS === 'android') {
      setShowStartDatePicker(false);
    }

    if (selectedDate) {
      setTempStartDate(selectedDate);
      const formattedDate = formatDateForAPI(selectedDate);
      setStartDate(formattedDate);

      // Si la date de fin est avant la nouvelle date de début, on met à jour la date de fin
      if (endDate) {
        const [endDay, endMonth, endYear] = endDate.split('/').map(Number);
        const endDateObj = new Date(endYear, endMonth - 1, endDay);
        if (selectedDate > endDateObj) {
          const newEndDate = new Date(selectedDate);
          newEndDate.setDate(newEndDate.getDate() + 1);
          setTempEndDate(newEndDate);
          setEndDate(formatDateForAPI(newEndDate));
        }
      }

      // Sur iOS, on ferme le picker une fois la sélection faite
      if (Platform.OS === 'ios') {
        setShowStartDatePicker(false);
      }
    }
  };

  const handleEndDateChange = (event: any, selectedDate?: Date) => {
    // Sur iOS, on ne ferme pas automatiquement le picker
    if (Platform.OS === 'android') {
      setShowEndDatePicker(false);
    }

    if (selectedDate) {
      // Vérifier que la date de fin est après la date de début
      if (selectedDate < tempStartDate) {
        Alert.alert('Erreur', 'La date de fin doit être après la date de début');
        return;
      }
      setTempEndDate(selectedDate);
      setEndDate(formatDateForAPI(selectedDate));

      // Sur iOS, on ferme le picker une fois la sélection faite
      if (Platform.OS === 'ios') {
        setShowEndDatePicker(false);
      }
    }
  };

  // Upload de l'image
  const uploadImageToCloudinary = async (imageUri: string, imageName: number) => {
    const cloudName = 'dtovi7wy6';
    const uploadPreset = 'kids-spot';
    const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

    try {
      setUploading(true);

      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append('file', `data:image/jpeg;base64,${base64}`);
      formData.append('upload_preset', uploadPreset);
      formData.append('public_id', imageName.toString());

      const response = await fetch(apiUrl, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data && data.secure_url) {
        setCloudImageUrl(data.secure_url);
      } else {
        Alert.alert('Erreur', 'Le téléversement a échoué.');
      }
    } catch (error) {
      console.error('Erreur lors du téléversement vers Cloudinary :', error);
      Alert.alert('Erreur', 'Une erreur est survenue pendant le téléversement.');
    } finally {
      setUploading(false);
    }
  };

  // Styles personnalisés pour les éléments de date
  const dateStyles = StyleSheet.create({
    dateContainer: {
      marginBottom: 10,
    },
    dateInput: {
      borderWidth: 1,
      borderColor: '#333', // Bordure plus foncée
      borderRadius: 8,
      padding: 12,
      backgroundColor: 'white',
    },
    dateText: {
      color: '#000', // Texte noir
      fontSize: 16,
      fontWeight: '500', // Un peu plus gras
    },
    pickerContainer: {
      marginTop: 10,
      borderWidth: Platform.OS === 'ios' ? 1 : 0,
      borderColor: '#ccc',
      borderRadius: 8,
      backgroundColor: Platform.OS === 'ios' ? '#fff' : 'transparent',
      overflow: 'hidden',
    }
  });

  // Charge les information d'un lieu (mode edition)
  useEffect(() => {
    if (place?.id) {
      const imageUrl = `${IMAGE_BASE_URL}${place.id}.jpg`;
      setCloudImageUrl(imageUrl);
      setImage(imageUrl);
    } else {
      setImage(undefined);
      setCloudImageUrl(undefined);
    }

    if (place) {
      setPlaceName(place.nom || '');
      setDescription(place.description || '');
      setHoraires(place.horaires || '');
      setAddress(place.adresse?.adresse || '');
      setVille(place.adresse?.ville || '');
      setCodepostal(place.adresse?.code_postal || '');
      setPhoneNumber(place.adresse?.telephone || '');
      setWebsite(place.adresse?.site_web || '');

      // Le type est un tableau, on prend le premier (si il existe)
      setSelectedTypeIds(place.type?.[0]?.id ? [place.type[0].id] : []);
      const placeTypeFromId = place.type?.[0]?.id === 1 ? 'restaurant' : place.type?.[0]?.id === 2 ? 'leisure' : place.type?.[0]?.id === 3 ? 'culture' : 'restaurant'; // Valeur par défaut
      setPlaceType(placeTypeFromId);

      // Gérer les équipements (en supposant que place.equipements est un tableau d'objets équipement)
      const initialEquipments: EquipmentType = {
        strollerAccess: false,
        playArea: false,
        microwave: false,
        highChair: false,
        changingTable: false,
        parking: false,
      };

      place.equipements?.forEach(equip => {
        switch (equip.id) {
          case 1: initialEquipments.strollerAccess = true; break;
          case 2: initialEquipments.playArea = true; break;
          case 3: initialEquipments.microwave = true; break;
          case 4: initialEquipments.highChair = true; break;
          case 5: initialEquipments.changingTable = true; break;
          case 6: initialEquipments.parking = true; break;
          default: break;
        }
      });
      setEquipments(initialEquipments);

      // Gérer les tranches d'âge
      setAgeRanges(place.ages?.map(age => {
        switch (age.id) {
          case 1: return '0-2';
          case 2: return '3-6';
          case 3: return '7+';
          default: return '';
        }
      }).filter(age => age !== ''));

      if (place.date_evenement?.debut && place.date_evenement?.fin) {
        setStartDate(formatDateForDisplay(place.date_evenement.debut));
        setEndDate(formatDateForDisplay(place.date_evenement.fin));
        setTempStartDate(new Date(place.date_evenement.debut.split('/').reverse().join('-')));
        setTempEndDate(new Date(place.date_evenement.fin.split('/').reverse().join('-')));
        setIsEvent(true);
      } else {
        setIsEvent(false);
      }

    }
  }, [place]);

  // Edite le lieux
  const handleEdite = async () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir enregistrer les modifications de ce lieu ?',
      [
        {
          text: 'Non',
        },
        {
          text: 'Oui',
          onPress: async () => {
            if (token && lieuId) {
              try {
                const typeIdMap: Record<PlaceType, number> = { restaurant: 1, leisure: 2, culture: 3 };
                const equipmentIdMap: Record<EquipmentKeys, number> = {
                  strollerAccess: 1, playArea: 2, microwave: 3,
                  highChair: 4, changingTable: 5, parking: 6
                };
                const ageRangeIdMap: Record<string, number> = { '0-2': 1, '3-6': 2, '7+': 3 };

                const equipements: number[] = Object.keys(equipments)
                  .filter(key => equipments[key as EquipmentKeys])
                  .map(key => equipmentIdMap[key as EquipmentKeys]);

                const tranches_age: number[] = ageRanges.map(age => ageRangeIdMap[age]);

                const fullAddress = `${address.trim()}, ${codepostal.trim()}, France`;
                const coords = await geocode(fullAddress);

                if (!coords) {
                  Alert.alert(
                    'Erreur de géolocalisation',
                    'Impossible de récupérer les coordonnées GPS de cette adresse. Vérifiez que l\'adresse est correcte et réessayez.',
                    [{ text: 'OK' }]
                  );
                  return;
                }

                const updatedData = {
                  id: lieuId,
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
                  equipements: equipements,
                  tranches_age: tranches_age,
                  ...(isEvent && { date_debut: startDate, date_fin: endDate }),
                };

                await updatePlaceOrEvent(updatedData, token);

              } catch (errorEdit) {
                console.error("Erreur lors de la mise à jour du lieu :", error);
                Alert.alert('Erreur', 'Une erreur est survenue lors de la mise à jour.');
              }
            } else {
              Alert.alert('Erreur', 'Vous devez être connecté pour modifier un lieu.');
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (successEdit) {
      refreshLocation();
      Alert.alert(
        'Succès',
        'Le lieu a été modifié avec succès',
        [{ text: 'OK', onPress: () => router.push('main') }]
      );
    } else if (errorEdit) {
      if (fieldErrorsEdit) {
        // Formater et afficher les erreurs de validation pour chaque champ
        const errorMessages = Object.entries(fieldErrorsEdit)
          .map(([field, message]) => `${field} : ${message}`)
          .join('\n');

        Alert.alert('Erreur(s) de validation', errorMessages);
      }
    }
  }, [errorEdit, successEdit])

  if (grade < 2) {
    return (
      <>
        <Row style={{ marginLeft: 0 }}>
          <BackButton />
        </Row>
        <View style={styles.scrollView}>
          <View style={{ alignItems: "center", marginTop: 35 }}>
            <Logo />
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' }}>
              Accès réservé
            </Text>
            <Text style={{ fontSize: 16, textAlign: 'center', color: 'gray' }}>
              Cette page est exclusivement réservée aux membres <Text style={{ fontWeight: 'bold', color: '#007AFF' }}>Premium</Text> et aux administrateurs.
            </Text>
          </View>
        </View>
      </>

    )
  }

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <BurgerMenu />
      {lieuId ? (
        <Title text={'Editer un lieu'} />
      ) :
        (<Title text={'Ajouter un lieu'} />)
      }

      <ScrollView style={styles.scrollView}>
        <View style={styles.section}>
          <Text style={styles.label}>Nom du lieu</Text>
          <FormInput
            label=""
            value={placeName}
            onChangeText={setPlaceName}
            placeholder="Entrez le nom du lieu"
            maxLength={35}
          />
          <Text style={{ alignSelf: 'flex-end', marginTop: 4 }}>
            {placeName.length}/35
          </Text>
          <PhotoPickerButton onPhotoSelected={(uri) => setImage(uri)} initialImage={image} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Type de lieu</Text>
          <FiltreButtons
            selectedTypeIds={selectedTypeIds}
            onPress={(id) => {
              setSelectedTypeIds([id]);
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
              <Text style={styles.label}>Date de début de l'événement</Text>
              <TouchableOpacity
                onPress={() => setShowStartDatePicker(true)}
                style={dateStyles.dateInput}
              >
                <Text style={dateStyles.dateText}>
                  {startDate ? formatDateForDisplay(startDate) : 'Sélectionner une date'}
                </Text>
              </TouchableOpacity>

              {showStartDatePicker && (
                <View style={[dateStyles.pickerContainer, { alignItems: 'center' }]}>
                  <DateTimePicker
                    value={tempStartDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleStartDateChange}
                    minimumDate={new Date()}
                    textColor="#000" // Texte noir pour iOS
                    accentColor={colorButtonFirst} // Couleur d'accent pour iOS
                    themeVariant="light" // Thème clair pour meilleure visibilité
                    style={{ backgroundColor: Platform.OS === 'ios' ? '#fff' : 'transparent' }}
                  />
                </View>
              )}
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Date de fin de l'événement</Text>
              <TouchableOpacity
                onPress={() => setShowEndDatePicker(true)}
                style={dateStyles.dateInput}
              >
                <Text style={dateStyles.dateText}>
                  {endDate ? formatDateForDisplay(endDate) : 'Sélectionner une date'}
                </Text>
              </TouchableOpacity>

              {showEndDatePicker && (
                <View style={[dateStyles.pickerContainer, { alignItems: 'center' }]}>
                  <DateTimePicker
                    value={tempEndDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'inline' : 'default'}
                    onChange={handleEndDateChange}
                    minimumDate={tempStartDate}
                    textColor="#000" // Texte noir pour iOS
                    accentColor={colorButtonFirst} // Couleur d'accent pour iOS
                    themeVariant="light" // Thème clair pour meilleure visibilité
                    style={{ backgroundColor: Platform.OS === 'ios' ? '#fff' : 'transparent' }}
                  />
                </View>
              )}
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
          <View style={styles.section2}>
            {ageRangeOptions.map((age) => (
              <TouchableOpacity
                key={age}
                onPress={() => toggleAgeRange(age)}
              >
                <AgeBadges
                  tranchesAge={[getTranslatedLabel(age)]}
                  badgeColor={ageRanges.includes(age) ? colorButtonFirst : '#ddd'}
                />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {lieuId ? (
          <SubmitButton title="Editer le lieu" onPress={handleEdite} />
        ) :
          (
            <SubmitButton title="Ajouter le lieu" onPress={handleSubmit} />
          )}

        <View style={styles.bottomSpacer} />
      </ScrollView>
      <Navigation />
    </SafeAreaView>
  );
};

export default AddPlaceScreen;