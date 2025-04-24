import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import * as Font from "expo-font";
import { router } from "expo-router";

const loadFonts = async () => {
  await Font.loadAsync({
    'BebasNeue-Regular': require('../assets/fonts/BebasNeue-Regular.ttf'),
  });
};

export default function Index() {
  const [fontsLoaded, setFontsLoaded] = useState(false);

  useEffect(() => {
    const prepare = async () => {
      try {
        await loadFonts();
        setFontsLoaded(true);
      } catch (e) {
        console.warn("Erreur lors du chargement des polices:", e);
        setFontsLoaded(true); // continue même en cas d'erreur
      }
    };

    prepare();
  }, []);

  useEffect(() => {
    if (fontsLoaded) {
      router.replace('/splash'); // Redirection vers le SplashScreen
    }
  }, [fontsLoaded]);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" color="#D37230" />
      <Text style={{ marginTop: 10 }}>Chargement des polices...</Text>
    </View>
  );
}
