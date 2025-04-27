// src/pages/Logout.tsx
import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Logout() {
  const { setToken } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Fonction pour gérer la déconnexion
    const handleLogout = async () => {
      try {
        // Définir un indicateur de déconnexion explicite
        await AsyncStorage.setItem('userLoggedOut', 'true');
        
        // Supprimer le token et sa date d'expiration du stockage
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('tokenExpirationDate');
        
        // Mettre à jour le contexte d'authentification
        setToken(null);
        
        // Rediriger vers la page d'accueil
        router.replace("/accueil");
      } catch (error) {
        console.error("Erreur lors de la déconnexion:", error);
        // En cas d'erreur, rediriger quand même vers l'accueil
        router.replace("/accueil");
      }
    };

    // Exécuter la déconnexion dès le chargement du composant
    handleLogout();
  }, [setToken, router]);

  // Le composant ne rend rien visuellement
  return null;
}