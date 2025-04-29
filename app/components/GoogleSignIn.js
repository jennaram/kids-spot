import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';
import React, { useEffect } from 'react';
import { Button } from 'react-native';

// Configuration de Google Sign-In
GoogleSignin.configure({
  // Votre webClientId depuis google-services.json
  webClientId: 'VOTRE_WEB_CLIENT_ID', // À remplacer par votre Web Client ID
  offlineAccess: true,
});

export const GoogleSignInButton = () => {
  useEffect(() => {
    // Vérifier le statut de connexion au chargement
    checkSignInStatus();
  }, []);

  const checkSignInStatus = async () => {
    try {
      const isSignedIn = await GoogleSignin.isSignedIn();
      if (isSignedIn) {
        // L'utilisateur est déjà connecté
        getCurrentUserInfo();
      }
    } catch (error) {
      console.error('Erreur lors de la vérification du statut:', error);
    }
  };

  const getCurrentUserInfo = async () => {
    try {
      const userInfo = await GoogleSignin.signInSilently();
      console.log('User Info:', userInfo);
      // Gérer les informations de l'utilisateur ici
    } catch (error) {
      console.error('Erreur lors de la récupération des informations:', error);
    }
  };

  const signIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      console.log('Connexion réussie:', userInfo);
      // Gérer la connexion réussie ici
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        console.log('Connexion annulée');
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log('Connexion en cours');
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log('Play Services non disponibles');
      } else {
        console.error('Erreur de connexion:', error);
      }
    }
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      console.log('Déconnexion réussie');
      // Gérer la déconnexion ici
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  return (
    <>
      <Button title="Se connecter avec Google" onPress={signIn} />
      <Button title="Se déconnecter" onPress={signOut} />
    </>
  );
};

export default GoogleSignInButton;
