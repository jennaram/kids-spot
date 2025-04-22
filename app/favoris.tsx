import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import Layout from './components/LayoutNav';
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth, fontSubtitle } from './style/styles';
import { fontTitle, loadFonts } from './style/styles';

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
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <Layout
      activeTab="favorite"
      onMapPress={() => navigation.navigate('Map')}
      onCalendarPress={() => navigation.navigate('Calendar')}
      onAddPress={() => navigation.navigate('Add')}
      onFavoritePress={() => navigation.navigate('Favorites')}
    >
      <View style={styles.container}>
        <Text style={[fontTitle]}>FAVORIS</Text>
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
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    paddingHorizontal: 10,
    backgroundColor: '#f5f5f5',
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
