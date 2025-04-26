import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, ScrollView, Button, TouchableOpacity, StyleSheet } from 'react-native';
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
import { Comment } from '@/Types/comments'; // <- nouveau type importé

export default function PlaceScreen() {
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [averageNote, setAverageNote] = useState<string | null>(null);
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleFetchPlace() {
    setLoading(true);
    setError(false);
    const result = await fetchPlace(2);
    if (result === null) {
      setError(true);
    } else {
      setPlace(result.data);
      setNearbyPlaces([]);
      setComments([]);
    }
    setLoading(false);
  }

  async function handleFetchNearbyPlaces() {
    setLoading(true);
    setError(false);
    const result = await fetchNearbyPlaces(48.843, 2.358);
    if (result === null) {
      setError(true);
    } else {
      setNearbyPlaces(result.data);
      setPlace(null);
      setComments([]);
    }
    setLoading(false);
  }

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
          <TouchableOpacity style={styles.button} onPress={handleFetchPlace}>
            <Text style={styles.buttonText}>Charger un lieu</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={handleFetchNearbyPlaces}>
            <Text style={styles.buttonText}>Lieux proches</Text>
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