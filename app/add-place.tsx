import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';

const AddPlaceScreen = () => {
  const router = useRouter();
  
  // États du formulaire
  const [placeType, setPlaceType] = useState<'restaurant' | 'culture' | 'leisure'>('restaurant');
  const [placeName, setPlaceName] = useState('');
  const [address, setAddress] = useState('');
  const [location, setLocation] = useState<{latitude: number, longitude: number} | null>(null);
  const [description, setDescription] = useState('');
  const [ageRanges, setAgeRanges] = useState<string[]>(['0-2']);
  const [rating, setRating] = useState(3);
  
  // Équipements disponibles
  const [equipments, setEquipments] = useState({
    strollerAccess: false,
    playArea: false,
    microwave: false,
    highChair: false,
    changingTable: false
  });

  const placeIcons = {
    restaurant: require('../assets/images/user-location-restaurant.png'),
    culture: require('../assets/images/user-location-culture.png'),
    leisure: require('../assets/images/user-location-loisir.png'),
  };

  const handleGetCurrentLocation = async () => {
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
      setAddress(`${addressResult.street}, ${addressResult.city}`);
    }
  };

  const handleSubmit = () => {
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
    router.back();
  };

  const toggleAgeRange = (age: string) => {
    setAgeRanges(prev => 
      prev.includes(age) 
        ? prev.filter(a => a !== age) 
        : [...prev, age]
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
      {/* Titre centré */}
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Ajouter un lieu</Text>
      </View>

      {/* Nom du lieu tout en haut */}
      <View style={styles.section}>
        <Text style={styles.label}>Nom du lieu*</Text>
        <TextInput
          style={styles.input}
          value={placeName}
          onChangeText={setPlaceName}
          placeholder="Nom du lieu"
          autoFocus
        />
      </View>

      {/* Type de lieu */}
      <View style={styles.section}>
        <Text style={styles.label}>Type de lieu*</Text>
        <View style={styles.radioContainer}>
          {['restaurant', 'culture', 'leisure'].map((type) => (
            <TouchableOpacity
              key={type}
              style={[styles.radioButton, placeType === type && styles.radioSelected]}
              onPress={() => setPlaceType(type)}
            >
              <Text style={[styles.radioText, placeType === type && styles.radioTextSelected]}>
                {type === 'restaurant' ? 'Restaurant' : 
                 type === 'culture' ? 'Culturel' : 'Loisir'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Équipements */}
      <View style={styles.section}>
        <Text style={styles.label}>Équipements disponibles</Text>
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

      {/* Description */}
      <View style={styles.section}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, { height: 100 }]}
          value={description}
          onChangeText={setDescription}
          multiline
          placeholder="Décrivez le lieu..."
        />
      </View>

      {/* Tranche d'âge */}
      <View style={styles.section}>
        <Text style={styles.label}>Tranche d'âge (plusieurs choix possibles)</Text>
        <View style={styles.radioContainer}>
          {['0-2', '3-6', '7+'].map((age) => (
            <TouchableOpacity
              key={age}
              style={[styles.radioButton, ageRanges.includes(age) && styles.radioSelected]}
              onPress={() => toggleAgeRange(age)}
            >
              <Text style={[styles.radioText, ageRanges.includes(age) && styles.radioTextSelected]}>
                {age === '0-2' ? '0-2 ans' : age === '3-6' ? '3-6 ans' : '7 ans et plus'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Adresse */}
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

      {/* Carte */}
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
            scrollEnabled={false}
          >
            <Marker coordinate={location}>
              <Image
                source={placeIcons[placeType]}
                style={{ width: 40, height: 40 }}
              />
            </Marker>
          </MapView>
        </View>
      )}

      {/* Notation */}
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

      {/* Bouton d'enregistrement */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitText}>Enregistrer</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  headerContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
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
    backgroundColor: '#D37230',
    borderColor: '#D37230',
  },
  radioText: {
    color: '#2c3e50',
  },
  radioTextSelected: {
    color: 'white',
  },
  addressButtons: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  locationButton: {
    backgroundColor: '#D37230',
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
    backgroundColor: '#D37230',
    borderRadius: 8,
    padding: 15,
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