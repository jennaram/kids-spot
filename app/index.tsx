import React, { useState, useEffect } from "react";
import { Image, Text, View, Button, ActivityIndicator } from "react-native";
import { useRouter } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import * as Font from 'expo-font';
import { fontTitle } from "./style/styles";

const Stack = createNativeStackNavigator();

// Fonction de chargement des polices
const loadFonts = async () => {
  await Font.loadAsync({
    'BebasNeue-Regular': require('../assets/fonts/BebasNeue-Regular.ttf')
  });
};

export default function Index() {
  const router = useRouter();
  const [fontsLoaded, setFontsLoaded] = useState(false);
  
  // Chargement des polices au démarrage de l'application
  useEffect(() => {
    async function prepare() {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (e) {
        console.warn('Erreur lors du chargement des polices:', e);
        // En cas d'erreur, on continue quand même
        setFontsLoaded(true);
      }
    }
    
    prepare();
  }, []);
  
  // Affichage d'un chargement pendant que les polices se chargent
  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color="#D37230" />
        <Text style={{ marginTop: 10 }}>Chargement...</Text>
      </View>
    );
  }
  
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Image
        source={require('../assets/images/Logo.png')}
        style={{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 20 }}
      />
      <Text style={[fontTitle, {
        marginBottom: 20
      }]}>
        Bienvenue sur Kids Spot
      </Text>
      <Button title="Accueil" onPress={() => router.push('/accueil')} /> 
      <Button title="Voir la carte" onPress={() => router.push('/main')} />
      <Button title="Evenement" onPress={() => router.push('/evenement')} />
      <Button title="Voir le detail des lieux" onPress={() => router.push('/details_lieu')} />
      <Button title="Ajouter un lieux" onPress={() => router.push('/add-place')} />
      <Button title="Inscription" onPress={() => router.push('/registration')} />
      <Button title="A propos" onPress={() => router.push('/about')} />
      <Button title="Menu burger" onPress={() => router.push('/components/menuburger')} />
      <Button title="Contact" onPress={() => router.push('/contact')} />
      <Button title="Connexion" onPress={() => router.push('/login')} />
      <Button title="Avis" onPress={() => router.push('/avis')} /> 
      <Button title="favoris" onPress={() => router.push('/favoris')} /> 
      <Button title="Mon profil" onPress={() => router.push('/profil')} /> 
    </View>
  );
}