/**
 * Module d'inscription utilisateur
 * 
 * Ce composant permet à un nouvel utilisateur de créer un compte en fournissant
 * ses informations personnelles. Il fait partie du flux d'authentification
 * et propose également une option d'inscription via Google.
 * 
 * @module RegistrationScreen
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
  Text,
  View,
  Modal,
  ActivityIndicator,
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import { colorButtonThird } from '../style/styles';
import { fontTitle } from '../style/styles';

// Composants
import { BackButton } from '../components/BackButton';
import { FormInput } from '../components/Form/InputField';
import { SubmitButton } from '../components/Form/SubmitButton';
import { AuthFooterLink } from '../components/InlineLink';

import { useRegisterUser } from '@/hooks/user/useRegisterUser';
import AppLogo from '../components/AppLogo';

// Initialise la session d'authentification potentielle en cours
WebBrowser.maybeCompleteAuthSession();

/**
 * Composant d'écran pour l'inscription d'un nouvel utilisateur
 * Permet à l'utilisateur de créer un compte avec ses informations personnelles
 * ou de s'inscrire via Google
 * @returns {JSX.Element} Le composant d'écran rendu
 */
export default function RegistrationScreen() {
  // État pour les champs du formulaire d'inscription
  const [formData, setFormData] = useState({
    pseudo: '',       // Nom d'utilisateur choisi
    email: '',        // Adresse email de contact
    password: '',     // Mot de passe
    confirmPassword: '', // Confirmation du mot de passe
    phone: '',        // Numéro de téléphone
  });

  // Hook personnalisé pour gérer l'inscription utilisateur
  const {
    submit,        // Fonction de soumission du formulaire
    loading,       // État de chargement pendant la soumission
    success,       // État indiquant si l'inscription a réussi
    error,         // Message d'erreur général
    fieldErrors,   // Erreurs spécifiques par champ
  } = useRegisterUser();

  /**
   * Configuration de l'authentification Google avec les identifiants clients
   * pour différentes plateformes
   */
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    androidClientId: "VOTRE_CLIENT_ID_ANDROID",
    iosClientId: "VOTRE_CLIENT_ID_IOS",
    webClientId: "VOTRE_CLIENT_ID_WEB",
  });

  /**
   * Effet pour traiter la réponse de l'authentification Google
   * Déclenche la fonction de connexion Google quand une réponse positive est reçue
   */
  useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleGoogleSignIn(googleResponse.authentication?.accessToken);
    }
  }, [googleResponse]);

  /**
   * Effet pour gérer les résultats de la tentative d'inscription
   * Affiche un message de confirmation et redirige ou affiche des erreurs de validation
   */
  useEffect(() => {
    if (success) {
      // En cas de succès, afficher un message et rediriger vers l'accueil
      Alert.alert('Succès', 'Inscription réussie !');
      router.replace('/accueil');
    } else if (error) {
      //console.log(fieldErrors);
      if (fieldErrors) {
        // Formater et afficher les erreurs de validation pour chaque champ
        const errorMessages = Object.entries(fieldErrors)
          .map(([field, message]) => `${field} : ${message}`)
          .join('\n');

        Alert.alert('Erreur(s) de validation', errorMessages);
      }
    }
  }, [success, fieldErrors]);

  /**
   * Gère l'authentification avec Google
   * Récupère les informations de l'utilisateur et redirige vers l'écran des points
   * @param {string} token - Token d'accès Google
   */
  const handleGoogleSignIn = async (token?: string) => {
    if (!token) return;

    try {
      // Récupérer les informations de l'utilisateur à partir du token
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = await response.json();
      if (userData) router.replace('/points');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la connexion avec Google');
    }
  };

  /**
   * Met à jour l'état du formulaire lors de la saisie utilisateur
   * @param {string} field - Nom du champ à mettre à jour
   * @param {string} value - Nouvelle valeur du champ
   */
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Gère la soumission du formulaire d'inscription
   * Valide les entrées et envoie la demande d'inscription à l'API
   */
  const handleSignUp = async () => {
    // Validation: les mots de passe doivent correspondre
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    // Soumission du formulaire avec les données validées
    await submit({
      pseudo: formData.pseudo,
      mail: formData.email,
      mot_de_passe: formData.password,
      telephone: formData.phone,
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Bouton de retour pour naviguer vers l'écran précédent */}
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      {/* KeyboardAvoidingView ajuste la vue quand le clavier apparaît */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo de l'application */}
          <View style={styles.logoContainer}>
            <AppLogo size={120} />
          </View>

          {/* Titre de l'écran */}
          <Text style={[fontTitle, styles.titleText]}>Inscription</Text>

          {/* Formulaire d'inscription */}
          <View style={styles.formContainer}>
            {/* Champ pour le pseudo */}
            <FormInput
              label="Pseudo"
              value={formData.pseudo}
              onChangeText={(text) => handleInputChange('pseudo', text)}
              placeholder="Votre pseudo"
            />

            {/* Champ pour l'email */}
            <FormInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="email@exemple.com"
              keyboardType="email-address"
            />

            {/* Champ pour le mot de passe */}
            <FormInput
              label="Mot de passe"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              placeholder="••••••••"
              secureTextEntry
            />

            {/* Champ pour confirmer le mot de passe */}
            <FormInput
              label="Confirmation"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              placeholder="••••••••"
              secureTextEntry
            />

            {/* Champ pour le numéro de téléphone */}
            <FormInput
              label="Téléphone"
              value={formData.phone}
              onChangeText={(text) => handleInputChange('phone', text)}
              placeholder="06 12 34 56 78"
              keyboardType="phone-pad"
            />

            {/* Bouton pour soumettre le formulaire */}
            <SubmitButton
              title="S'inscrire"
              onPress={handleSignUp}
            />

            {/* Lien vers l'écran de connexion */}
            <AuthFooterLink
              text="Déjà un compte ?"
              linkText="Connectez-vous"
              onPress={() => router.push('/login')}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de chargement pendant l'inscription */}
      <Modal
        visible={loading}
        transparent
        animationType="fade"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.modalText}>Connexion en cours...</Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

/**
 * Styles pour l'écran d'inscription
 */
const styles = StyleSheet.create({
  // Style pour la zone sécurisée qui évite les encoches et éléments système
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  // Style du conteneur principal
  container: {
    flex: 1,
  },
  // Style du contenu défilable avec marge inférieure
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  // Style du bouton retour positionné en haut à gauche
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 10,
  },
  // Style du conteneur du logo
  logoContainer: {
    alignItems: 'center',
    marginTop: 35,
  },
  // Style du contenu principal
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  // Style du titre de l'écran
  titleText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  // Style du conteneur du formulaire
  formContainer: {
    width: '100%',
    borderRadius: 12,
    padding: 20,
  },
  // Styles pour le modal de chargement
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fond semi-transparent
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
  },
});