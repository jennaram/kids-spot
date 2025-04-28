import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Button, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import fetchPlace from '../api/fetchPlace';
import fetchNearbyPlaces from '../api/fetchNearbyPlaces';
import fetchComments from '../api/fetchComments';
import ErrorScreen from '@/components/ErrorScreen';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/NavBar/Navigation';
import { Place } from '@/Types/place';
import { PlaceDetail } from '@/Types/placeDetail';
import { Comment } from '@/Types/comments';
import { useAuth } from '@/context/auth/AuthContext';
import { authService } from '@/services/authService';
import { useLocation } from '@/context/locate';
import addFavorite from '@/api/fetchAddFavorite';
import deleteFavorite from '@/api/fetchDeleteFavorite';

export default function PlaceScreen() {
  // favoris
  const { favorites } = useLocation();

  // Un lieu en détaille
  const [place, setPlace] = useState<PlaceDetail | null>(null);

  // Liste des lieux autour
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);

  // Commentaire d'un lieu
  const [comments, setComments] = useState<Comment[]>([]);
  // Note du lieux
  const [averageNote, setAverageNote] = useState<string | null>(null);

  // Erreurs
  const [error, setError] = useState(false);

  // Token lors du login
  const { token, setToken } = useAuth();

  // Chargement
  const [loading, setLoading] = useState(false);


  async function handleFetchComments() {
    setLoading(true);
    setError(false);
    const result = await fetchComments(2);
    if (result === null) {
      setError(true);
    } else {
      setComments(result.data.commentaires);
      setAverageNote(result.data.moyenne_notes);
      setPlace(null);
      setNearbyPlaces([]);
    }
    setLoading(false);
  }

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

  async function handleFavorites() {
    console.log(favorites);
    
  }

  async function handleDeleteToFavorites(lieuId: number) {
    try {
      // Récupérer le token depuis votre système d'authentification (localStorage, contexte, etc.)

      if (!token) {
        Alert.alert('Erreur', 'Vous devez être connecté pour ajouter un favori');
        return;
      }
      
      // ID du lieu à ajouter aux favoris
      

      // Appel de votre fonction
      const response = await deleteFavorite(lieuId, token);

      // Traiter la réponse
      console.log('Lieu supprimé des favoris:', response);

      // Afficher un message de succès à l'utilisateur
      alert('Lieu supprimé des favoris avec succès !');
    } catch (error) {
      console.error('Erreur lors de la suppréssion  des favoris:', error);
      alert('Erreur lors de la suppression des favoris');
    }
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

          <TouchableOpacity style={styles.button} onPress={handleFavorites}>
            <Text style={styles.buttonText}>Favoris</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => handleDeleteToFavorites(2)} // Utilisez l'ID du lieu actuel
          >
            <Text style={styles.buttonText}>supprime des favoris</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleFetchComments}>
            <Text style={styles.buttonText}>Commentaires</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>

      {/* Contenu principal qui prend l'espace restant */}
      <View style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={{ padding: 16 }}>
          {place && (
            <View style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{place.nom}</Text>
              <Text>Description: {place.description}</Text>
              <Text>Adresse: {place.adresse?.adresse}, {place.adresse?.ville}</Text>
            </View>
          )}

          {nearbyPlaces.length > 0 && nearbyPlaces.map((p) => (
            <View key={p.id} style={{ marginBottom: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{p.nom}</Text>
              <Text>Description: {p.description}</Text>
              <Text>Adresse: {p.adresse?.adresse}, {p.adresse?.ville}</Text>
            </View>
          ))}

          {comments.length > 0 && (
            <View style={{ marginTop: 20 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 10 }}>Commentaires :</Text>

              {averageNote && (
                <Text style={{ fontSize: 16, color: 'orange', marginBottom: 10 }}>
                  Note moyenne : {parseFloat(averageNote).toFixed(1)}/5
                </Text>
              )}

              {comments.map((commentaire) => (
                <View key={commentaire.id} style={{ marginBottom: 10 }}>
                  <Text style={{ fontStyle: 'italic' }}>"{commentaire.commentaire}"</Text>
                  <Text>Note : {commentaire.note}/5</Text>
                  <Text style={{ fontSize: 12, color: 'gray' }}>
                    Par {commentaire.user.pseudo} le {commentaire.date.ajout}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </ScrollView>
      </View>

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