/**
 * Composant de déconnexion
 * 
 * Ce composant fonctionnel gère le processus de déconnexion de l'utilisateur.
 * Il ne rend aucun élément visuel et exécute automatiquement la déconnexion
 * dès son montage dans l'arbre des composants.
 * 
 * @module Logout
 */

import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth";
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Composant de déconnexion qui nettoie les données d'authentification
 * et redirige l'utilisateur vers la page d'accueil.
 */
export default function Logout() {
  // Récupère la fonction setToken du contexte d'authentification
  const { setToken } = useAuth();
  
  // Hook de navigation d'Expo Router
  const router = useRouter();

  useEffect(() => {
    /**
     * Gère le processus complet de déconnexion
     * - Définit un indicateur de déconnexion
     * - Supprime les données d'authentification du stockage local
     * - Réinitialise le contexte d'authentification
     * - Redirige vers la page d'accueil
     */
    const handleLogout = async () => {
      try {
        // Définit un indicateur explicite que l'utilisateur s'est déconnecté volontairement
        // Cela peut être utile pour différencier une déconnexion manuelle d'une expiration de session
        await AsyncStorage.setItem('userLoggedOut', 'true');
        
        // Supprime les informations d'authentification du stockage local
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('tokenExpirationDate');
        
        // Réinitialise le contexte d'authentification en définissant le token à null
        // Cela déclenchera une mise à jour dans tous les composants qui utilisent ce contexte
        setToken(null);
        
        // Redirige l'utilisateur vers la page d'accueil
        // L'option 'replace' empêche l'utilisateur de revenir à cette page via le bouton retour
        router.replace("/accueil");
      } catch (error) {
        // Journalise l'erreur pour le débogage
        console.error("Erreur lors de la déconnexion:", error);
        
        // Même en cas d'erreur, on redirige l'utilisateur vers l'accueil
        // pour éviter qu'il ne reste bloqué sur une page de déconnexion
        router.replace("/accueil");
      }
    };

    // Exécute la fonction de déconnexion immédiatement après le montage du composant
    handleLogout();
    
    // Les dépendances de l'effet sont setToken et router
    // L'effet sera exécuté à nouveau si ces valeurs changent
  }, [setToken, router]);

  // Ce composant est un composant fonctionnel qui ne rend aucun élément visuel
  // Il sert uniquement à exécuter la logique de déconnexion
  return null;
}