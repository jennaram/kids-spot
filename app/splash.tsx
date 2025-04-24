// splash.tsx
import React, { useEffect, useState } from 'react';
import { View, Image, ActivityIndicator, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import * as Font from 'expo-font';
import AsyncStorage from '@react-native-async-storage/async-storage';

const loadFonts = async () => {
  await Font.loadAsync({
    'BebasNeue-Regular': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });
};

export default function SplashScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function initApp() {
      try {
        await loadFonts();

        // Simule une vérification du token
        const token = await AsyncStorage.getItem('userToken');

        setTimeout(() => {
          if (token) {
            router.replace('/main'); // utilisateur connecté
          } else {
            router.replace('/accueil'); // utilisateur non connecté
          }
        }, 1500); // délai pour affichage splash
      } catch (e) {
        console.error('Erreur chargement Splash:', e);
        router.replace('/accueil'); // fallback en cas d'erreur
      }
    }

    initApp();
  }, []);

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/Logo.png')} style={styles.logo} />
      <Text style={{ fontSize: 20, marginTop: 20 }}>Chargement de l'application...</Text>
      <ActivityIndicator size="large" color="#D37230" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff',
  },
  logo: {
    width: 200, height: 200, resizeMode: 'contain',
  },
});
