import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  SafeAreaView,
  TextInput,
} from 'react-native';
import { useLocation } from '@/context/locate/LocationContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from './types/navigation';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import Icon from 'react-native-vector-icons/Feather';
import BackButton from './components/BackButton';
import { useAuth } from '@/context/auth/AuthContext';
import { useDeleteFavorite } from '@/hooks/favorite/useDeleteFavorite';
import { Navigation } from '@/components/NavBar/Navigation';
import FavoriteStyles from '../app/style/FavorisStyle';
import { IMAGE_BASE_URL } from '@/api/apiConfig';

const Favoris = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { favorites, loading, error, refreshFavorites } = useLocation();
  const [search, setSearch] = useState<string>('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const { token } = useAuth();
  const {
    removeFavorite,
    loading: deleting,
    success: deleteSuccess,
    error: deleteError,
    reset: resetDeleteFavorite,
  } = useDeleteFavorite();

  
  const [imageError, setImageError] = useState(false);

  const handleRemoveFavori = async (id: string) => {
    if (!token) {
      console.error('Token non disponible pour la suppression');
      return;
    }
    await removeFavorite(Number(id), token);
  };

  useEffect(() => {
    if (deleteSuccess) {
      refreshFavorites();
      resetDeleteFavorite();
    }
  }, [deleteSuccess]);

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
      <View style={FavoriteStyles.favoriCard}>
        <TouchableOpacity
          style={FavoriteStyles.trashIconContainer}
          onPress={() => handleRemoveFavori(item.id)}
        >
          <Icon name="trash-2" size={20} />
        </TouchableOpacity>

        <Image
          source={
            imageError
              ? require('@/assets/images/carte.png')
              : { uri: `${IMAGE_BASE_URL}${item.id}.jpg` }
          }
          style={FavoriteStyles.image}
          onError={() => setImageError(true)}
        />
        <View style={FavoriteStyles.favoriDetails}>
          <Text style={FavoriteStyles.favoriName}>{item.nom}</Text>
          <Text style={FavoriteStyles.favoriDescription}>{item.description}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={FavoriteStyles.loaderContainer}>
        <BackButton style={FavoriteStyles.backButton} />
        <Title text="Favoris" />
        <ActivityIndicator size="large" />
        <Text>Chargement...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={FavoriteStyles.loaderContainer}>
        <BackButton style={FavoriteStyles.backButton} />
        <Title text="Favoris" />
        <Text>Erreur : {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={FavoriteStyles.safeArea}>
      <BurgerMenu />
      <View>
        <Title text="Favoris" />
        <TextInput
          style={{ margin: 10, padding: 10, backgroundColor: '#eee', borderRadius: 10 }}
          placeholder="Rechercher un lieu favori"
          value={search}
          onChangeText={setSearch}
        />
        {filteredFavoris.length > 0 ? (
          <FlatList
            style={{ padding: 10, marginBottom: 220 }}
            data={filteredFavoris}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
        ) : (
          <Text style={FavoriteStyles.noFavorisText}>Aucun favori trouvé.</Text>
        )}
      </View>
      <Navigation />
    </SafeAreaView>
  );
};

export default Favoris;
