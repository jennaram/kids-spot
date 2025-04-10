import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

const AddPlaceScreen = () => {
  const router = useRouter();
  
  // États du formulaire
  const [placeType, setPlaceType] = useState<'restaurant' | 'culture' | 'leisure'>('restaurant'); // Type par défaut
  const [placeName, setPlaceName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [description, setDescription] = useState('');
  const [ageRange, setAgeRange] = useState('0-2'); // Tranche d'âge par défaut
  const [rating, setRating] = useState(3); // Note par défaut
  
  // Équipements disponibles (tous désactivés par défaut)
  const [equipments, setEquipments] = useState({
    strollerAccess: false,
    playArea: false,
    microwave: false,
    highChair: false,
    changingTable: false
  });

  // Correspondance entre types de lieux et icônes
  const placeIcons = {
    restaurant: require('../assets/images/user-location-restaurant.png'),
    culture: require('../assets/images/user-location-culture.png'),
    leisure: require('../assets/images/user-location-loisir.png'),
  };

  /**
   * Récupère la position actuelle de l'utilisateur
   * et met à jour l'adresse approximative
   */
  const handleGetCurrentLocation = async () => {
    // 1. Demande de permission
    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Erreur', 'Permission de localisation refusée');
      return;
    }

    // 2. Récupération de la position
    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });

    // 3. Reverse geocoding pour obtenir l'adresse (simplifié)
    const [addressResult] = await Location.reverseGeocodeAsync({
      latitude: currentLocation.coords.latitude,
      longitude: currentLocation.coords.longitude,
    });
    
    if (addressResult) {
      setAddress(`${addressResult.street}, ${addressResult.city}`);
    }
  };

  /**
   * Validation et soumission du formulaire
   */
  const handleSubmit = () => {
    // Vérification des champs obligatoires
    if (!placeName || !address) {
      Alert.alert('Erreur', 'Veuillez remplir les champs obligatoires');
      return;
    }

    // Construction de l'objet lieu
    const newPlace = {
      name: placeName,
      type: placeType,
      address,
      location,
      description,
      ageRange,
      rating,
      equipments
    };

    console.log('Nouveau lieu:', newPlace); // Pour débogage
    Alert.alert('Succès', 'Lieu ajouté avec succès!');
    router.back(); // Retour à l'écran précédent
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* En-tête */}
      <Text style={styles.header}>Ajouter un lieu</Text>

      {/* Section Type de lieu */}
      <View style={styles.section}>
        <Text style={styles.label}>Type de lieu*</Text>
        <View style={styles.radioContainer}>
          {['restaurant', 'culture', 'leisure'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.radioButton, placeType === type && styles.radioSelected]}
              onPress={() => setPlaceType(type)}
            >
              <Text style={styles.radioText}>
                {type === 'restaurant' ? 'Restaurant' : 
                 type === 'culture' ? 'Culturel' : 'Loisir'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Section Nom du lieu */}
      <View style={styles.section}>
        <Text style={styles.label}>Nom du lieu*</Text>
        <TextInput
          style={styles.input}
          value={placeName}
          onChangeText={setPlaceName}
          placeholder="Nom du lieu"
        />
      </View>

      {/* Section Adresse */}
      <View style={styles.section}>
        <Text style={styles.label}>Adresse*</Text>
        <View style={styles.addressButtons}>
          <TouchableOpacity 
            style={styles.locationButton} 
            onPress={handleGetCurrentLocation}
          >
            <Text style={styles.buttonText}>Utiliser ma position</Text>
          </TouchableOpacity>
        </View>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Adresse complète"
        />
      </View>

      {/* Mini-carte de prévisualisation */}
      {location && (
        <View style={styles.mapContainer}>
          <MapView
            style={styles.map}
            initialRegion={{
              latitude: location.latitude,
              longitude: location.longitude,
              latitudeDelta: 0.01,
              longitudeDelta: 0.01,
            }}
            scrollEnabled={false} // Désactive le déplacement
          >
            <Marker coordinate={location}>
              <Image
                source={placeIcons[placeType]} // Icône dynamique selon le type
                style={{ width: 40, height: 40 }}
              />
            </Marker>
          </MapView>
        </View>
      )}

      {/* Section Équipements */}
      <View style={styles.section}>
        <Text style={styles.label}>Équipements</Text>
        {Object.keys(equipments).map((item) => (
          <TouchableOpacity
            key={item}
            style={styles.checkbox}
            onPress={() => setEquipments({...equipments, [item as keyof typeof equipments]: !equipments[item as keyof typeof equipments]})}
          >
            <View style={[styles.checkboxBox, equipments[item as keyof typeof equipments] && styles.checkboxSelected]}>
              {equipments[item as keyof typeof equipments] && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.checkboxLabel}>
              {item === 'strollerAccess' ? 'Accès poussette' :
               item === 'playArea' ? 'Aire de jeux' :
               item === 'microwave' ? 'Micro-onde' :
               item === 'highChair' ? 'Chaise haute' : 'Table à langer'}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Section Tranche d'âge */}
      <View style={styles.section}>
        <Text style={styles.label}>Tranche d'âge</Text>
        <View style={styles.radioContainer}>
          {['0-2', '3-6', '7+'].map((age) => (
            <TouchableOpacity
              key={age}
              style={[styles.radioButton, ageRange === age && styles.radioSelected]}
              onPress={() => setAgeRange(age)}
            >
              <Text style={styles.radioText}>
                {age === '0-2' ? '0-2 ans' : age === '3-6' ? '3-6 ans' : '7 ans et plus'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Section Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Description du lieu..."
        />
      </View>

      {/* Section Notation */}
      <View style={styles.section}>
        <Text style={styles.label}>Note (sur 5)</Text>
        <View style={styles.ratingContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={[styles.star, star <= rating && styles.starSelected]}>★</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Bouton de soumission */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles détaillés
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    color: '#34495e',
  },
  input: {
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  radioContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginVertical: 5,
  },
  radioButton: {
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bdc3c7',
  },
  radioSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  radioText: {
    color: '#2c3e50',
  },
  addressButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: '#3498db',
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
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
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#bdc3c7',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: '#3498db',
    borderColor: '#3498db',
  },
  checkmark: {
    color: 'white',
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  ratingContainer: {
    flexDirection: 'row',
    marginVertical: 10,
  },
  star: {
    fontSize: 30,
    color: '#bdc3c7',
    marginRight: 5,
  },
  starSelected: {
    color: '#f1c40f',
  },
  submitButton: {
    backgroundColor: '#2ecc71',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginVertical: 20,
  },
  submitText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default AddPlaceScreen;