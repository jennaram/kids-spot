/**
 * Écran de connexion de l'application
 * 
 * Ce fichier implémente l'interface de connexion permettant aux utilisateurs
 * de s'authentifier via leur email et mot de passe.
 * 
 * @module LoginScreen
 */

import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
  View,
  Modal,
  ActivityIndicator,
  Text,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth/AuthContext';
import { useLoginUser } from '@/hooks/user/useLoginUser';

import { BackButton } from '../components/BackButton';
import { AppLogo } from '../components/AppLogo';
import { FormInput } from '../components/Form/InputField';
import { AuthButton } from '../components/Form/MainButton';
import { AuthSeparator } from '../components/Form/SeparatorWithText ';
import { AuthFooterLink } from '../components/InlineLink';
import { Title } from '@/components/Title';

/**
 * Composant principal de l'écran de connexion
 * Gère le formulaire de connexion et l'authentification de l'utilisateur
 */
export default function LoginScreen() {
  // État pour stocker les identifiants de l'utilisateur (email et mot de passe)
  const [credentials, setCredentials] = useState({ email: '', password: '' });

  // Récupération de la fonction setToken du contexte d'authentification
  const { setToken } = useAuth();

  // Hook personnalisé pour gérer la logique de connexion
  const { submit, loading, data, error } = useLoginUser();

  /**
   * Effet secondaire exécuté quand les données de connexion changent
   * Sauvegarde le token d'authentification et redirige vers la page principale si la connexion réussit
   */
  useEffect(() => {
    if (data?.token) {
      setToken(data.token, data.expiresIn * 1000);
      Alert.alert('Succès', 'Connexion réussie');
      router.replace('/main');
    }
  }, [data, setToken]);

  /**
   * Met à jour l'état des identifiants quand l'utilisateur saisit du texte
   * @param {string} field - Le champ à mettre à jour ('email' ou 'password')
   * @param {string} value - La nouvelle valeur du champ
   */
  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  /**
   * Gère la soumission du formulaire de connexion
   * Vérifie les champs, affiche le modal de chargement et appelle l'API de connexion
   */
  const handleEmailLogin = async () => {
    const { email, password } = credentials;

    // Validation des champs avant soumission
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    // Affiche le modal de chargement et lance la connexion
    await submit(email, password);

    // Gestion des erreurs de connexion
    if (error) {
      Alert.alert('Erreur de connexion', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Bouton de retour à l'écran précédent */}
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      {/* KeyboardAvoidingView permet d'ajuster la vue quand le clavier apparaît */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo de l'application */}
          <View style={styles.logoContainer}>
            <AppLogo size={120} />
          </View>

          {/* Titre de l'écran */}
          <Title text={'Connexion'} />

          {/* Contenu principal du formulaire */}
          <View style={styles.content}>
            {/* Champ pour l'adresse email */}
            <FormInput
              label="Adresse mail"
              value={credentials.email}
              onChangeText={text => handleInputChange('email', text)}
              placeholder="email@exemple.com"
              keyboardType="email-address"
            />

            {/* Champ pour le mot de passe */}
            <FormInput
              label="Mot de passe"
              value={credentials.password}
              onChangeText={text => handleInputChange('password', text)}
              placeholder="••••••••"
              secureTextEntry
            />

            {/* Bouton de connexion */}
            <AuthButton
              title="Connexion"
              onPress={handleEmailLogin}
            />

            {/* Lien vers la page de récupération de mot de passe */}
            <AuthFooterLink
              text="Mot de passe oublié ?"
              onPress={() => router.push('/users/forgotpassword')}
            />

            {/* Séparateur avec le texte "ou" */}
            <AuthSeparator text="ou" />

            {/* Emplacement pour le bouton de connexion Google (commenté) */}

            {/* Lien vers la page d'inscription */}
            <View style={styles.signUpContainer}>
              <AuthFooterLink
                text="Vous n'avez pas de compte ?"
                linkText="Inscrivez-vous"
                onPress={() => router.push('/users/registration')}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Modal de chargement affiché pendant la connexion */}
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
 * Styles pour l'écran de connexion
 * Définit l'apparence des différents éléments de l'interface
 */
const styles = StyleSheet.create({
  // Style pour la zone safe area (évite les notches et autres éléments système)
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Style du conteneur principal
  container: {
    flex: 1,
  },
  // Style pour le bouton de retour
  backButton: {
    position: 'absolute',
    top: Platform.select({ ios: 50, android: 30 }),
    left: 20,
    zIndex: 10,
  },
  // Style pour le conteneur de défilement
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  // Style pour le conteneur du logo
  logoContainer: {
    marginTop: 35,
    alignItems: 'center',
  },
  // Style pour le contenu principal
  content: {
    flex: 1,
  },
  // Style pour le conteneur du lien d'inscription
  signUpContainer: {
    marginTop: 20,
    justifyContent: 'center',
  },

  // Styles pour le modal de chargement
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
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