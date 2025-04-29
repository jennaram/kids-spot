
import { View, Text, ActivityIndicator, ScrollView, Button, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import ErrorScreen from '@/components/ErrorScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/NavBar/Navigation';
import { Place } from '@/Types/place';
import { PlaceDetail } from '@/Types/placeDetail';
import { useAuth } from '@/context/auth/AuthContext';
import { authService } from '@/services/authService';
import { useLocation } from '@/context/locate';
import { useState } from 'react';
import { fetchAllComments } from '@/api/commentsServices';
import { useReadAllComments } from '@/hooks/comments/useAllComments';

export default function PlaceScreen() {
  // favoris
  const { favorites } = useLocation();

  // Un lieu en détaille
  const [place, setPlace] = useState<PlaceDetail | null>(null);

  // Liste des lieux autour
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);

  // Commentaire d'un lieu

  // Note du lieux
  const [averageNote, setAverageNote] = useState<string | null>(null);

  // Erreurs


  // Token lors du login
  const { token, setToken } = useAuth();

  // Chargement





  async function handleLogin() {
    const email = 'seb.prod@gmail.com';  // Utilisateur d'exemple
    const password = 'sebT5656';  // Mot de passe d'exemple
    try {
      const authResult = await authService.login(email, password);
      setToken(authResult.token); // Sauvegarder le token dans le contexte
      Alert.alert('Connexion réussie', 'Vous êtes connecté avec succès !');
    } catch (error) {
      Alert.alert('Erreur de connexion', 'Impossible de se connecter avec ces identifiants.');
    }
  }

  const { comments, loading, error } = useReadAllComments(1); // par exemple

  if (loading) return <Text>Chargement...</Text>;
  if (error) return <Text>{error}</Text>;

  async function handleGetComment() {




  }






  if (loading) return <ActivityIndicator />;

  if (error) return <ErrorScreen message="Erreur lors du chargement des données." />;

  return (
    <SafeAreaView style={{ flex: 1, paddingBottom: 70 }}>
      <BurgerMenu />
      <Title text={'Test des requêtes API'} />

      {/* Barre de boutons */}
      <View style={{ height: 70, marginVertical: 10 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContainer}
        >
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleGetComment}>
            <Text style={styles.buttonText}>lire commentaire</Text>
          </TouchableOpacity>


        </ScrollView>
      </View>
      <FlatList
        data={comments}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item.commentaire}</Text>
            <Text>{item.note}/5</Text>
            <Text>{item.user.pseudo}</Text>
            <Text>{item.date.ajout}</Text>
          </View>
        )}
      />


      <Navigation />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  scrollContainer: {
    paddingHorizontal: 10,
    gap: 10,
    marginVertical: 10,
    marginBottom: 10
  },
  button: {
    backgroundColor: '#3498db',
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 120,
    height: 50, // ← Taille fixe en hauteur
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
});