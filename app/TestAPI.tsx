
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/NavBar/Navigation';
import { useAuth } from '@/context/auth/AuthContext';
import { useAddFavorite } from '@/hooks/favorite/useAddFavorite';
import { useDeleteFavorite } from '@/hooks/favorite/useDeleteFavorite';
import { useReadAllFavorites } from '@/hooks/favorite/useReadAllFavorites';
import { useProfilUser } from '@/hooks/user/useProfilUser';
import { useEffect } from 'react';

export default function PlaceScreen() {



  // Token lors du login
  const { token, setToken } = useAuth();
  const {profil} = useProfilUser(token ?? '');

  async function handleLogin() {
    const email = 'seb.prod@gmail.com';  // Utilisateur d'exemple
    const password = 'sebT5656';  // Mot de passe d'exemple
    try {
      //const authResult = await authService.login(email, password);
      //setToken(authResult.token); // Sauvegarder le token dans le contexte
      Alert.alert('Connexion réussie', 'Vous êtes connecté avec succès !');
    } catch (error) {
      Alert.alert('Erreur de connexion', 'Impossible de se connecter avec ces identifiants.');
    }
  }



useEffect(() => {
  if(profil) {
    console.log(profil);
  }
}, [profil]);

  


  // if (error) {
  //   console.log("Erreur générale :", error);
  //   //console.log(fieldErrors)
  // }

  // if (loading) {
  //   console.log("Chargment...")
  // }

  // if (success) {
  //   console.log("Tout est ok")
  // }



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
{/* : 
          <TouchableOpacity style={styles.button} onPress={handleSubmit}>
            <Text style={styles.buttonText}>Test</Text>
          </TouchableOpacity>

*/}
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


