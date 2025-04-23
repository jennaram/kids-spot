import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import Layout from './components/LayoutNav';
import { fontTitle } from './style/styles';
import LieuCard from './components/LieuxCard'; // Assure-toi que le chemin est correct

interface Favori {
  id: string;
  nom: string;
  imageUrl: string;
  description: string;
  // ajoute les autres props attendues par LieuCard si nécessaire
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
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[fontTitle]}>FAVORIS</Text>
        {favoris.length > 0 ? (
          favoris.map((favori) => (
            <LieuCard key={favori.id} point={favori} distance={null} />
          ))
        ) : (
          <Text style={styles.noFavorisText}>Aucun favori trouvé.</Text>
        )}
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 20,
    paddingHorizontal: 10,
    paddingBottom: 60,
    backgroundColor: '#f5f5f5',
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
