
import { View, Text, ActivityIndicator, ScrollView, Button, TouchableOpacity, StyleSheet, Alert, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import { Navigation } from '@/components/NavBar/Navigation';
import { useAuth } from '@/context/auth/AuthContext';
import { authService } from '@/services/authService';
import { useAddLocationOrEvent } from '@/hooks/locate/useAddLocation';

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

  const { submitLocationOrEvent, loading, error, success, fieldErrors } = useAddLocationOrEvent();
  async function handleSubmit() {
    if (!token) {
      console.error("Token manquant : authentification requise");
      return; // Ou afficher une erreur dans l’interface
    }
  
    await submitLocationOrEvent({
      nom: "",
      description: "seb",
      horaires: "ZZZ",
      adresse: "ZZZ",
      ville: "ZZZ",
      code_postal: "89100",
      longitude: 2,
      latitude: 2,
      telephone: "0666666666",
      site_web: "https://bibliotheques.paris.fr",
      id_type: 1,
      equipements: [1, 2],
      tranches_age: [2, 1]
    }, token);
  }

  if(error){
    console.log("Erreur générale :", error);
     console.log(fieldErrors)

  if (typeof error === "object" && error !== null && "response" in error) {
    const responseData = (error as any).response.data;

    if (responseData?.errors) {
      for (const [champ, message] of Object.entries(responseData.errors)) {
        console.log(`Champ : ${champ} => Message : ${message}`);
      }
    }
  }
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