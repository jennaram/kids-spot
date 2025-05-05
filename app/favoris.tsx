import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useLocation } from "@/context/locate/LocationContext";
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import Icon from 'react-native-vector-icons/Feather';

import {
  colorButtonFirst,
  colorButtonSecondary,
  colorButtonThird,
  colorFourth,
} from './style/styles';

const Favoris = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { favorites, loading, error, refreshFavorites } = useLocation();
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  const handleRemoveFavori = async (id: string) => {
    try {
      const response = await fetch(`https://your-api-url.com/favoris/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        refreshFavorites(); // recharge les favoris depuis le context
      } else {
        console.error('Erreur lors de la suppression du favori');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

  const filteredFavoris = (favorites || []).filter((favori) => {
    const matchSearch = favori.nom.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType ? favori.type?.toLowerCase() === selectedType : true;
    return matchSearch && matchType;
  });

  const renderItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('details_lieu', { id: item.id })}
      activeOpacity={0.9}
    >
      <View style={styles.favoriCard}>
        {/* Icône poubelle */}
        <TouchableOpacity
          style={styles.trashIconContainer}
          onPress={() => handleRemoveFavori(item.id)}
        >
          <Icon name="trash-2" size={20}/>
        </TouchableOpacity>
  
        <Image source={{ uri: item.imageUrl }} style={styles.favoriImage} />
        <View style={styles.favoriDetails}>
          <Text style={styles.favoriName}>{item.nom}</Text>
          <Text style={styles.favoriDescription}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <BurgerMenu />
        <Title text="Favoris" />
        <ActivityIndicator size="large" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.loaderContainer}>
        <BurgerMenu />
        <Title text="Favoris" />
        <Text>Erreur : {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <BurgerMenu />
      <View style={styles.container}>
        <Title text="Favoris" />

        <View style={styles.searchRow}>
          <TextInput
            style={styles.searchInput}
            placeholder="Rechercher un lieu favori"
            value={search}
            onChangeText={setSearch}
          />
          <TouchableOpacity
            style={styles.equipButton}
            onPress={() => console.log('Afficher les équipements')}
          >
            <Text style={{ color: 'white' }}>Équipements</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.filterRow}>
          {['Restaurant', 'Loisirs', 'Culturel'].map((type) => {
            const isSelected = selectedType === type.toLowerCase();
            return (
              <TouchableOpacity
                key={type}
                style={[
                  styles.filterButton,
                  isSelected && styles.filterButtonActive,
                ]}
                onPress={() =>
                  setSelectedType(isSelected ? null : type.toLowerCase())
                }
              >
                <Text
                  style={[
                    styles.filterText,
                    isSelected && styles.filterTextActive,
                  ]}
                >
                  {type}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {filteredFavoris.length > 0 ? (
          <FlatList
            data={filteredFavoris}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text style={styles.noFavorisText}>Aucun favori trouvé.</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  container: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
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
    backgroundColor: colorButtonFirst,
  },
  filterText: {
    color: '#000',
  },
  filterTextActive: {
    color: colorButtonThird,
  },
  favoriCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  favoriImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  favoriDetails: {
    flex: 1,
    marginLeft: 15,
  },
  favoriName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: colorButtonFirst,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noFavorisText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  trashIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
  },
  
});

export default Favoris;