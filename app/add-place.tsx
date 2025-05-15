import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { useAuth } from '@/context/auth';
import { useAddPlaceOrEvent } from '@/hooks/place/useAddPlace';
import {
  View, Text, Switch, TextInput, ScrollView, TouchableOpacity,
  Alert, SafeAreaView, Modal, ActivityIndicator, StyleSheet
} from 'react-native';
import * as Location from 'expo-location';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';

// Composants
import { Navigation } from '@/components/NavBar/Navigation';
import { Title } from '@/components/Title';
import { FormInput } from './components/Form/InputField';
import SubmitButton from './components/Form/SubmitButton';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { PhotoPickerButton } from '@/components/PhotoPickerButton';
import { AvailableEquipments, EquipmentKeys, EquipmentType } from '@/components/Lieux/AvailableEquipments';
import GeoLocationInput from '@/components/Lieux/GeoLocationInput';

// Styles
import { colorButtonFirst } from './style/styles';
import { useGeocodeAddress } from '@/hooks/location/useGeocodeAddress';
import { useSendMail } from '@/hooks/place/useSendMail';

// Types
import { AddPlaceOrEventPayload } from '@/Types/place';

type PlaceType = 'restaurant' | 'culture' | 'leisure';

const AddPlaceScreen = () => {
  const router = useRouter();
  const { token } = useAuth();

  // États
  const [image, setImage] = useState<string>();
  const [cloudImageUrl, setCloudImageUrl] = useState<string>();
  const [selectedTypeIds, setSelectedTypeIds] = useState<number[]>([]);
  const [placeType, setPlaceType] = useState<PlaceType>('restaurant');
  const [placeName, setPlaceName] = useState('');
  const [address, setAddress] = useState('');
  const [description, setDescription] = useState('');
  const [ageRanges, setAgeRanges] = useState<string[]>(['0-2']);
  const [website, setWebsite] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [codepostal, setCodepostal] = useState('');
  const [ville, setVille] = useState('');
  const [horaires, setHoraires] = useState('');
  const [isEvent, setIsEvent] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [equipments, setEquipments] = useState<EquipmentType>({
    strollerAccess: false,
    playArea: false,
    microwave: false,
    highChair: false,
    changingTable: false,
    parking: false,
  });

  // Hooks
  const { submitPlaceOrEvent, loading: loadingSubmit, error, success: successSubmit, id } = useAddPlaceOrEvent();
  const { submitMail, loading: loadingMail, success: successMail } = useSendMail();
  const [uploading, setUploading] = useState(false);
  const { geocode } = useGeocodeAddress();

  const loading = loadingSubmit || loadingMail || uploading;
  const success = successSubmit && successMail && cloudImageUrl;
  const ageRangeOptions = ['0-2', '3-6', '7+'];

  // Couleurs
  const ORANGE = '#D37230';  // Nouvelle couleur orange
  const LIGHT_GRAY = '#F0F0F0';
  const WHITE = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
    width: '100%'
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333'
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bottomSpacer: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
  },
  // Styles unifiés pour les badges
  badgeContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 15,
  },
  badge: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#DDD'
  },
  selectedBadge: {
    backgroundColor: '#FF7F4B', // Orange
    borderWidth: 0,
  },
  unselectedBadge: {
    backgroundColor: '#E0E0E0', // Gris
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '500',
  },
  selectedBadgeText: {
    color: 'white',
  },
  unselectedBadgeText: {
    color: '#666',
  }
});
  

  // Fonctions
  const handleGetCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Erreur', 'Permission de localisation refusée');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const [addressResult] = await Location.reverseGeocodeAsync(location.coords);

      if (addressResult) {
        setAddress(addressResult.street || '');
        setVille(addressResult.city || '');
        setCodepostal(addressResult.postalCode || '');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Impossible d\'obtenir la localisation');
    }
  };

  const handleSubmit = async () => {
    if (!placeName || !address || !codepostal || !ville || selectedTypeIds.length === 0) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs obligatoires');
      return;
    }

    const fullAddress = `${address.trim()}, ${codepostal.trim()}, France`;
    const coords = await geocode(fullAddress);

    if (!coords) {
      Alert.alert('Erreur', 'Adresse introuvable');
      return;
    }

    const newPlace: AddPlaceOrEventPayload = {
      nom: placeName,
      description,
      horaires,
      adresse: address,
      ville,
      code_postal: codepostal,
      longitude: coords.lon,
      latitude: coords.lat,
      telephone: phoneNumber.trim(),
      site_web: website.trim(),
      id_type: selectedTypeIds[0],
      equipements: Object.entries(equipments)
        .filter(([_, value]) => value)
        .map(([key]) => {
          const equipmentMap: Record<string, number> = {
            strollerAccess: 1, playArea: 2, microwave: 3,
            highChair: 4, changingTable: 5, parking: 6
          };
          return equipmentMap[key];
        }),
      tranches_age: ageRanges.map(age => {
        const ageMap: Record<string, number> = { '0-2': 1, '3-6': 2, '7+': 3 };
        return ageMap[age];
      }),
      ...(isEvent && { date_debut: startDate, date_fin: endDate }),
    };

    await submitPlaceOrEvent(newPlace, token || '');
  };

  const toggleAgeRange = (age: string) => {
    setAgeRanges(prev => 
      prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
    );
  };

  const toggleEquipment = (key: EquipmentKeys) => {
    setEquipments(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const uploadImageToCloudinary = async (imageUri: string, imageName: number) => {
    try {
      setUploading(true);
      const base64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      const formData = new FormData();
      formData.append('file', `data:image/jpeg;base64,${base64}`);
      formData.append('upload_preset', 'kids-spot');
      formData.append('public_id', imageName.toString());

      const response = await fetch('https://api.cloudinary.com/v1_1/dtovi7wy6/image/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data?.secure_url) {
        setCloudImageUrl(data.secure_url);
      }
    } catch (error) {
      console.error('Upload error:', error);
    } finally {
      setUploading(false);
    }
  };

  // Effets
  useEffect(() => {
    if (successSubmit) {
      submitMail(
        "Nouveau lieu ajouté",
        `<h1>${placeName}</h1><p>${address}, ${ville}</p>`,
        token || ''
      );
    }
  }, [successSubmit]);

  useEffect(() => {
    if (id && image) {
      uploadImageToCloudinary(image, id);
    }
  }, [id]);

  useEffect(() => {
    if (success) {
      Alert.alert('Succès', 'Lieu ajouté', [
        { text: 'OK', onPress: () => router.push('main') }
      ]);
    }
  }, [success]);

  return (
    <><SafeAreaView style={styles.container}>
      <BurgerMenu />
      <Title text="Ajouter un lieu" />

      <ScrollView style={styles.scrollView}>
        {/* Section Nom + Photo */}
        <View style={styles.section}>
          <Text style={styles.label}>Nom du lieu</Text>
          <FormInput
            value={placeName}
            onChangeText={setPlaceName}
            placeholder="Nom du lieu"
            maxLength={35} label={''} />
          <Text style={{ alignSelf: 'flex-end' }}>{placeName.length}/35</Text>
          <PhotoPickerButton onPhotoSelected={setImage} />
        </View>

        {/* Section Type de lieu */}
        <View style={styles.section}>
          <Text style={styles.label}>Type de lieu</Text>
          <View style={styles.badgeContainer}>
            {[
              { id: 1, label: 'Restaurant' },
              { id: 2, label: 'Loisirs' },
              { id: 3, label: 'Culture' }
            ].map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setSelectedTypeIds([item.id])}
                style={[
                  styles.badge,
                  {
                    backgroundColor: selectedTypeIds.includes(item.id) ? ORANGE : LIGHT_GRAY,
                    borderWidth: selectedTypeIds.includes(item.id) ? 0 : 1,
                    borderColor: '#DDD'
                  }
                ]}
              >
                <Text style={[
                  styles.badgeText,
                  { color: selectedTypeIds.includes(item.id) ? WHITE : '#666' }
                ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>


        {/* Section Adresse */}
        <View style={styles.section}>
          <Text style={styles.label}>Adresse</Text>
          <GeoLocationInput
            address={address}
            onAddressChange={setAddress}
            onGetLocation={handleGetCurrentLocation} />
        </View>

        {/* Section Code Postal + Ville */}
        <View style={styles.section}>
          <Text style={styles.label}>Code Postal</Text>
          <FormInput
            value={codepostal}
            onChangeText={text => setCodepostal(text.replace(/[^0-9]/g, '').slice(0, 5))}
            placeholder="75000"
            keyboardType="numeric" label={''} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Ville</Text>
          <FormInput
            value={ville}
            onChangeText={setVille}
            placeholder="Paris" label={''} />
        </View>

        {/* Section Contact */}
        <View style={styles.section}>
          <Text style={styles.label}>Site web (optionnel)</Text>
          <FormInput
            value={website}
            onChangeText={setWebsite}
            placeholder="https://www.exemple.com" label={''} />
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Téléphone (optionnel)</Text>
          <FormInput
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(text.replace(/[^0-9]/g, '').slice(0, 10))}
            placeholder="0123456789"
            keyboardType="phone-pad" label={''} />
        </View>

        {/* Section Horaires */}
        <View style={styles.section}>
          <Text style={styles.label}>Horaires</Text>
          <FormInput
            value={horaires}
            onChangeText={setHoraires}
            placeholder="10h-18h" label={''} />
        </View>

        {/* Section Événement */}
        <View style={styles.section}>
          <Text style={styles.label}>Est-ce un événement ?</Text>
          <Switch value={isEvent} onValueChange={setIsEvent} />
        </View>

        {isEvent && (
          <>
            <View style={styles.section}>
              <Text style={styles.label}>Date de début</Text>
              <FormInput
                value={startDate}
                onChangeText={text => {
                  const cleaned = text.replace(/\D/g, '');
                  let formatted = cleaned.slice(0, 2);
                  if (cleaned.length > 2) formatted += `/${cleaned.slice(2, 4)}`;
                  if (cleaned.length > 4) formatted += `/${cleaned.slice(4, 8)}`;
                  setStartDate(formatted);
                } }
                placeholder="JJ/MM/AAAA" label={''} />
            </View>

            <View style={styles.section}>
              <Text style={styles.label}>Date de fin</Text>
              <FormInput
                value={endDate}
                onChangeText={text => {
                  const cleaned = text.replace(/\D/g, '');
                  let formatted = cleaned.slice(0, 2);
                  if (cleaned.length > 2) formatted += `/${cleaned.slice(2, 4)}`;
                  if (cleaned.length > 4) formatted += `/${cleaned.slice(4, 8)}`;
                  setEndDate(formatted);
                } }
                placeholder="JJ/MM/AAAA" label={''} />
            </View>
          </>
        )}

        {/* Section Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.multilineInput}
            value={description}
            onChangeText={setDescription}
            placeholder="Description du lieu"
            multiline />
        </View>

        {/* Section Équipements */}
        <View style={styles.section}>
          <AvailableEquipments
            equipments={equipments}
            toggleEquipment={toggleEquipment} />
        </View>

       
    {/* Section Tranche d'âge - Version identique à "Type de lieu" */}
<View style={styles.section}>
  <Text style={styles.label}>Tranche d'âge</Text>
  <View style={[styles.badgeContainer, { justifyContent: 'center' }]}>
    {[
      { id: '0-2', label: '0-2 ans' },
      { id: '3-6', label: '3-6 ans' },
      { id: '7+', label: '7 ans et plus' }
    ].map((item) => (
      <TouchableOpacity
        key={item.id}
        onPress={() => toggleAgeRange(item.id)}
        style={[
          styles.badge,
          {
            backgroundColor: ageRanges.includes(item.id) ? ORANGE : LIGHT_GRAY,
            borderWidth: ageRanges.includes(item.id) ? 0 : 1,
            borderColor: '#DDD'
          }
        ]}
      >
        <Text style={[
          styles.badgeText,
          { color: ageRanges.includes(item.id) ? WHITE : '#666' }
        ]}>
          {item.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
</View>

      {/* Section Bouton d'ajout */}
      <SubmitButton title="Ajouter le lieu" onPress={handleSubmit} />
      <View style={styles.bottomSpacer} />
    </ScrollView>
    <Modal visible={loading} transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <ActivityIndicator size="large" color="#FF7F4B" />
          <Text style={styles.modalText}>Enregistrement en cours...</Text>
        </View>
      </View>
    </Modal>
    <Navigation />
  </SafeAreaView>
  </>
  );

}

export default AddPlaceScreen;