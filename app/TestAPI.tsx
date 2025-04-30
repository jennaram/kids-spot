
import { View, Text, ActivityIndicator, ScrollView, Button, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/NavBar/Navigation';
import { Place } from '@/types/place';
import { PlaceDetail } from '@/types/placeDetail';
import { useAuth } from '@/context/auth/AuthContext';
import { authService } from '@/services/authService';
import { useLocation } from '@/context/locate';
import { useState } from 'react';
import { useReadAllComments } from '@/hooks/comments/useReadAllComments';
import { useAddComment } from '@/hooks/comments/useAddComment';

export default function PlaceScreen() {



  // Token lors du login
  const { token, setToken } = useAuth();







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
  
  const { submitComment, loading, error, success } = useAddComment();

  const handleSubmit = () => {
    submitComment(4, "Très sympa", 5, "userToken");
  };

  if(error){
    console.log(error);
  }
 


  

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

          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Ajouter</Text>
          </TouchableOpacity>


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