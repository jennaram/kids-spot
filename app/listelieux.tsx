import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Image,
  TextInput, Modal, Pressable
} from 'react-native';
import { mockPoints } from './points';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import Layout from './components/LayoutNav';
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth, fontSubtitle } from './style/styles';
import { fontTitle, loadFonts } from './style/styles';
import LieuCard from './components/LieuxCard';

const iconByType = {
  listIcon: require('../assets/images/switchlieux.png'),
};

//Fonction qui calcul la distance en KM
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const ALL_EQUIPMENTS = ["Accès pousette", "Aire de jeux / Animations", "Micro-ondes", "Chaise haute", "Table à langer"];

export default function ListeLieux() {
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [showEquipModal, setShowEquipModal] = useState(false);
  const [selectedEquipements, setSelectedEquipements] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') return;
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });
    })();
  }, []);

  const toggleEquipement = (equip: string) => {
    setSelectedEquipements((prev) =>
      prev.includes(equip)
        ? prev.filter((e) => e !== equip)
        : [...prev, equip]
    );
  };

  const filteredPoints = mockPoints.filter((point) => {
    const matchesSearch = point.nom.toLowerCase().includes(search.toLowerCase());
    const matchesType = selectedType ? point.type === selectedType.toLowerCase() : true;
    const matchesEquip = selectedEquipements.length > 0
      ? selectedEquipements.every((eq) => point.equipements.includes(eq))
      : true;

    return matchesSearch && matchesType && matchesEquip;
  });

  return (
    <Layout
    activeTab="map"
    onMapPress={() => navigation.navigate('Map')}
    onCalendarPress={() => navigation.navigate('Calendar')}
    onAddPress={() => navigation.navigate('Add')}
    onFavoritePress={() => navigation.navigate('Favorites')}
  >
    <View style={styles.container}>
      {/* Recherche & Bouton Équipement */}
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchInput}
          placeholder="Rechercher un lieu"
          value={search}
          onChangeText={setSearch}
        />
        <TouchableOpacity style={styles.equipButton} onPress={() => setShowEquipModal(true)}>
          <Text style={{ color: 'white' }}>Équipements</Text>
        </TouchableOpacity>
      </View>

      {/* Filtres principaux */}
      <View style={styles.filterRow}>
  {["Restaurant", "Loisirs", "Culturel"].map((type) => {
    const isSelected = selectedType === type.toLowerCase();
    return (
      <TouchableOpacity
        key={type}
        style={[styles.filterButton, isSelected && styles.filterButtonActive]}
        onPress={() => setSelectedType(isSelected ? null : type.toLowerCase())}
      >
        <Text style={[styles.filterText, isSelected && styles.filterTextActive]}>
          {type}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>


      {/* Liste des lieux */}
      <ScrollView contentContainerStyle={styles.listContainer}>
      {filteredPoints.map((point) => {
  const distance = userLocation
    ? getDistanceFromLatLonInKm(
        userLocation.latitude,
        userLocation.longitude,
        point.position.latitude,
        point.position.longitude
      ).toFixed(2)
    : null;

  return (
    <LieuCard key={point.id} point={point} distance={distance} />
  );
})}
      </ScrollView>

      {/* Bouton en bas à droite */}
      <TouchableOpacity onPress={() => router.push('/main')} style={styles.floatingButton}>
        <Image source={iconByType.listIcon} style={{ width: 40, height: 40 }} />
      </TouchableOpacity>

      <Modal visible={showEquipModal} transparent animationType="fade">
  <View style={styles.modalOverlay}>
    <View style={styles.modalContent}>
      <Text style={styles.modalTitle}>Choisissez des équipements :</Text>

      {ALL_EQUIPMENTS.map((equip) => (
        <TouchableOpacity
          key={equip}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingVertical: 6,
          }}
          onPress={() => toggleEquipement(equip)}
        >
          <View
            style={{
              width: 20,
              height: 20,
              borderRadius: 4,
              borderWidth: 1,
              borderColor: '#333',
              backgroundColor: selectedEquipements.includes(equip) ? '#34C759' : '#fff',
              marginRight: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {selectedEquipements.includes(equip) && (
              <Text style={{ color: colorButtonThird, fontWeight: 'bold' }}>✓</Text>
            )}
          </View>
          <Text>{equip}</Text>
        </TouchableOpacity>
      ))}

      <Pressable onPress={() => setShowEquipModal(false)} style={styles.modalValidate}>
        <Text style={{ color: 'white' }}>Valider</Text>
      </Pressable>
    </View>
  </View>
</Modal>

    </View>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colorButtonThird },
  searchRow: {
    flexDirection: 'row',
    padding: 12,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  equipButton: {
    paddingHorizontal: 12,
    justifyContent: 'center',
    backgroundColor: colorButtonSecondary,
    borderRadius: 8,
  },
  filterRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 8,
    paddingHorizontal: 8,
  },
  filterButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: colorButtonThird,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colorButtonFirst,
  },
  filterButtonActive: {
    backgroundColor: colorButtonFirst
  },
  filterText: {
    color: '#000',
  },
  filterTextActive: {
    color: colorButtonThird,
  },
  listContainer: {
    padding: 16,
    paddingBottom: 100,
  },
  item: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#f2f2f2',
    borderRadius: 10,
  },
  itemContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 8,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  description: {
    fontSize: 14,
    color: '#555',
  },
  info: {
    fontSize: 14,
    color: '#333',
    marginTop: 4,
  },
  distance: {
    marginLeft: 8,
    fontWeight: '600',
    color: colorButtonFirst
  },
  floatingButton: {
    position: 'absolute',
    bottom: 100,
    right: 10,
    borderRadius: 50,
    padding: 10,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    margin: 24,
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontWeight: 'bold',
    marginBottom: 12,
    fontSize: 16,
  },
  modalClose: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    alignItems: 'center',
  },
  modalValidate: {
    marginTop: 16,
    padding: 10,
    backgroundColor: colorButtonSecondary,
    borderRadius: 8,
    alignItems: 'center',
  },
});
