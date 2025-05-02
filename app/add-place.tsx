import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, Alert, SafeAreaView } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';

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

// Styles
import { colorButtonFirst } from './style/styles';
import styles from '@/app/style/add-place.styles';

// Types
type PlaceType = 'restaurant' | 'culture' | 'leisure';
type LocationType = { latitude: number; longitude: number } | null;
type EquipmentKeys = 'strollerAccess' | 'playArea' | 'microwave' | 'highChair' | 'changingTable';
type EquipmentType = Record<EquipmentKeys, boolean>;

const AddPlaceScreen = () => {
  const router = useRouter();

  // États du formulaire
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [placeName, setPlaceName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<LocationType>(null);
  const [description, setDescription] = useState('');
  const [ageRanges, setAgeRanges] = useState<string[]>(['0-2']);
  const [rating, setRating] = useState(3);
  const [equipments, setEquipments] = useState<EquipmentType>({
    strollerAccess: false,
    playArea: false,
    microwave: false,
    highChair: false,
    changingTable: false,
  });

  // Mémoïsation des données constantes
  const placeIcons = useMemo(() => ({
    restaurant: require('@/assets/images/user-location-restaurant.png'),
    culture: require('@/assets/images/user-location-culture.png'),
    leisure: require('@/assets/images/user-location-loisir.png'),
  }), []);

  const ageRangeOptions = useMemo(() => ['0-2', '3-6', '7+'], []);
  const ratingOptions = useMemo(() => [1, 2, 3, 4, 5], []);

  // Gestion de la localisation
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

  // Gestion de la soumission
  const handleSubmit = useCallback(() => {
    if (!placeName || !address) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    const newPlace = {
      name: placeName,
      type: placeType,
      address,
      location,
      description,
      ageRanges,
      rating,
      equipments
    };

    console.log('Nouveau lieu:', newPlace);
    Alert.alert('Succès', 'Lieu ajouté avec succès!');
    router.push('/home');
  }, [placeName, placeType, address, location, description, ageRanges, rating, equipments, router]);

  // Gestion des tranches d'âge
  const toggleAgeRange = useCallback((age: string) => {
    setAgeRanges((prev) => 
      prev.includes(age) ? prev.filter((a) => a !== age) : [...prev, age]
    );
  }, []);

  // Gestion des équipements
  const toggleEquipment = useCallback((key: EquipmentKeys) => {
    setEquipments(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  // Traduction des labels
  const getTranslatedLabel = (key: string, type: 'equipment' | 'ageRange') => {
    if (type === 'equipment') {
      return key === 'strollerAccess' ? 'Accès poussette' :
             key === 'playArea' ? 'Aire de jeux' :
             key === 'microwave' ? 'Micro-onde' :
             key === 'highChair' ? 'Chaise haute' : 'Table à langer';
    }
    
    return key === '0-2' ? '0-2 ans' : 
           key === '3-6' ? '3-6 ans' : '7 ans et plus';
  };

  function setPhotoUri(uri: string): void {
    throw new Error('Function not implemented.');
  }

  return (
    <SafeAreaView style={styles.container}>
      <BurgerMenu/>
      <Title text={'Ajouter un lieu'}/>
      
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

        {/* Type de lieu - utilisant FiltreButtons */}
        <View style={styles.section}>
          <Text style={styles.label}>Type de lieu</Text>
          <FiltreButtons 
            selectedTypeId={placeType === 'restaurant' ? 1 : placeType === 'leisure' ? 2 : 3}
            onPress={(id) => {
              const newType = id === 1 ? 'restaurant' : id === 2 ? 'leisure' : 'culture';
              setPlaceType(newType);
            }}
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Adresse</Text>
          <View style={styles.inputWithIcon}>
            <TextInput
              style={styles.inputWithIconField}
              placeholder="Entrez l'adresse complète"
              value={address}
              onChangeText={setAddress}
            />
            <TouchableOpacity 
              style={styles.iconContainer} 
              onPress={handleGetCurrentLocation}
            >
              <MaterialIcons name="my-location" size={24} color={colorButtonFirst} />
            </TouchableOpacity>
          </View>
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
          <Text style={styles.label}>Équipements disponibles</Text>
          {Object.entries(equipments).map(([key, value]) => (
            <TouchableOpacity
              key={key}
              style={styles.checkbox}
              onPress={() => toggleEquipment(key as EquipmentKeys)}
            >
              <View style={[styles.checkboxBox, value && styles.checkboxSelected]}>
                {value && <Text style={styles.checkmark}>✓</Text>}
              </View>
              <Text style={styles.checkboxLabel}>
                {getTranslatedLabel(key, 'equipment')}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tranche d'âge - utilisant AgeBadges */}
        <View style={styles.section}>
          <Text style={styles.label}>Tranche d'âge</Text>
          <View style={styles.ageBadgesContainer}>
            {ageRangeOptions.map((age) => (
              <TouchableOpacity
                key={age}
                onPress={() => toggleAgeRange(age)}
              >
                <AgeBadges
                  tranchesAge={[getTranslatedLabel(age, 'ageRange')]}
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
                  latitude: location.latitude,
                  longitude: location.longitude,
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

        {/* Note - utilisant StarRating */}
        <View style={styles.section}>
          <StarRating
            rating={rating}
            setRating={setRating}
            label="Note (sur 5)"
            containerStyle={styles.ratingContainer}
          />
        </View>

        <SubmitButton 
          title="Ajouter le lieu" 
          onPress={handleSubmit} 
        />
        
        <View style={styles.bottomSpacer} />
      </ScrollView>
      
      <Navigation />
    </SafeAreaView>
  );
};

export default AddPlaceScreen;