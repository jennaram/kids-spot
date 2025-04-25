import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  TextInput,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import Layout from './components/LayoutNav';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import {
  colorButtonFirst,
  colorButtonSecondary,
  colorButtonThird,
  colorFourth,
  fontSubtitle,
  fontTitle,
} from './style/styles';

interface Favori {
  id: string;
  nom: string;
  imageUrl: string;
  description: string;
}

const Favoris = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [favoris, setFavoris] = useState<Favori[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string | null>(null);

  useEffect(() => {
    const fetchFavoris = async () => {
      try {
        const response = await fetch('https://your-api-url.com/favoris');
        const data = await response.json();
        setFavoris(data);
      } catch (error) {
        console.error('Erreur lors de la récupération des favoris:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavoris();
  }, []);

  const handleRemoveFavori = async (id: string) => {
    try {
      const response = await fetch(`https://your-api-url.com/favoris/${id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        setFavoris(favoris.filter((favori) => favori.id !== id));
      } else {
        console.error('Erreur lors de la suppression du favori');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du favori:', error);
    }
  };

  const renderItem = ({ item }: { item: Favori }) => (
    <View style={styles.favoriCard}>
      <Image source={{ uri: item.imageUrl }} style={styles.favoriImage} />
      <View style={styles.favoriDetails}>
        <Text style={styles.favoriName}>{item.nom}</Text>
        <Text style={styles.favoriDescription}>{item.description}</Text>
        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveFavori(item.id)}
        >
          <Text style={styles.removeButtonText}>Retirer des favoris</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <BurgerMenu/>
        <Title text="Favoris" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.safeArea}>
      <BurgerMenu/>
      <Layout
        activeTab="favorite"
        onMapPress={() => navigation.navigate('Map')}
        onCalendarPress={() => navigation.navigate('Calendar')}
        onAddPress={() => navigation.navigate('Add')}
        onFavoritePress={() => navigation.navigate('Favorites')}
      >
        <View style={styles.container}>
          <Title text="Favoris" />

          {/* Recherche & Bouton Équipement */}
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

          {/* Filtres principaux */}
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

          {favoris.length > 0 ? (
            <FlatList
              data={favoris}
              renderItem={renderItem}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <Text style={styles.noFavorisText}>Aucun favori trouvé.</Text>
          )}
        </View>
      </Layout>
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
});

export default Favoris;