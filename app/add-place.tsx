import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, Alert, SafeAreaView } from 'react-native';
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

// Styles
import { colorButtonFirst, colorButtonThird } from './style/styles';
import { PhotoPickerButton } from '@/components/PhotoPickerButton';

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
  const placeTypeOptions = useMemo(() => ['restaurant', 'culture', 'leisure'], []);
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
  const getTranslatedLabel = (key: string, type: 'placeType' | 'equipment' | 'ageRange') => {
    if (type === 'placeType') {
      return key === 'restaurant' ? 'Restaurant' : 
             key === 'culture' ? 'Culturel' : 'Loisir';
    }
    
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

        {/* Type de lieu - aligné à gauche */}
        <View style={styles.section}>
          <Text style={styles.label}>Type de lieu</Text>
          <View style={styles.radioGroup}>
            {placeTypeOptions.map((type) => (
              <TouchableOpacity
                key={type}
                style={[
                  styles.radioButton, 
                  placeType === type && styles.radioSelected
                ]}
                onPress={() => setPlaceType(type as PlaceType)}
              >
                <Text style={[
                  styles.radioText, 
                  placeType === type && styles.radioTextSelected
                ]}>
                  {getTranslatedLabel(type, 'placeType')}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
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

        {/* Tranche d'âge - aligné à gauche */}
        <View style={styles.section}>
          <Text style={styles.label}>Tranche d'âge</Text>
          <View style={styles.radioGroup}>
            {ageRangeOptions.map((age) => (
              <TouchableOpacity
                key={age}
                style={[
                  styles.radioButton, 
                  ageRanges.includes(age) && styles.radioSelected
                ]}
                onPress={() => toggleAgeRange(age)}
              >
                <Text style={[
                  styles.radioText, 
                  ageRanges.includes(age) && styles.radioTextSelected
                ]}>
                  {getTranslatedLabel(age, 'ageRange')}
                </Text>
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

        {/* Note - aligné à gauche */}
        <View style={styles.section}>
          <Text style={styles.label}>Note (sur 5)</Text>
          <View style={styles.ratingGroup}>
            {ratingOptions.map((star) => (
              <TouchableOpacity 
                key={star} 
                onPress={() => setRating(star)}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={[
                  styles.star, 
                  star <= rating && styles.starSelected
                ]}>★</Text>
              </TouchableOpacity>
            ))}
          </View>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'left', 
  },
  // Groupes de boutons radio alignés à gauche
  radioGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start', // Alignement à gauche
  },
  ratingGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Alignement à gauche
  },
  radioButton: {
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  radioSelected: {
    backgroundColor: colorButtonFirst,
    borderColor: colorButtonFirst,
  },
  radioText: {
    color: '#333',
  },
  radioTextSelected: {
    color: 'white',
  },
  // ... (autres styles inchangés)
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputWithIconField: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  iconContainer: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 40, 
    height: 40
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: colorButtonFirst,
    borderColor: colorButtonFirst,
  },
  checkmark: {
    color: colorButtonThird,
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  star: {
    fontSize: 30,
    color: '#ddd',
    marginRight: 10,
  },
  starSelected: {
    color: '#f1c40f',
  },
  bottomSpacer: {
    height: 60,
  }
});

export default AddPlaceScreen;