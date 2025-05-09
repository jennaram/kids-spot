/**
 * Module de récupération de mot de passe
 * 
 * Ce composant permet à l'utilisateur d'initier le processus de récupération
 * de mot de passe en saisissant son adresse email. Un code de réinitialisation
 * sera envoyé à l'adresse fournie.
 * 
 * @module ForgotPasswordScreen
 */

import React, { useEffect, useState } from 'react';
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
  Text
} from 'react-native';
import { router } from 'expo-router'

// Composants optimisés
import { BackButton } from '../components/BackButton';
import { FormInput } from '../components/Form/InputField';
import { SubmitButton } from '../components/Form/SubmitButton';
import { AppLogo } from '../components/AppLogo';
import { useSendMAil } from '@/hooks/user/useSendMail';
import { Title } from '@/components/Title';

/**
 * Composant principal de l'écran de récupération de mot de passe
 * Permet à l'utilisateur de saisir son email pour recevoir un code de réinitialisation
 * @returns {JSX.Element} Le composant rendu
 */
export default function ForgotPasswordScreen() {
  // État pour stocker l'adresse email saisie
  const [email, setEmail] = useState('');

  // Hook personnalisé pour gérer l'envoi d'email
  const { send, loading, success, error } = useSendMAil();

  /**
   * Gère la soumission du formulaire de récupération de mot de passe
   * Valide l'email puis envoie la demande de réinitialisation
   */
  const handleResetPassword = () => {
    // Validation de l'email avant envoi
    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    // Appel à l'API pour envoyer l'email de réinitialisation
    send(email);
  };

  /**
   * Effet pour gérer les résultats de la tentative d'envoi d'email
   * Redirige l'utilisateur vers l'écran de saisie du code ou affiche une erreur
   */
  useEffect(() => {
    // En cas de succès, naviguer vers la page de saisie du code de réinitialisation
    if (!loading && success) {
      router.push({
        pathname: '/users/sendResetCode',
        params: { mail: email },
      });
    }

    // En cas d'erreur, afficher un message à l'utilisateur
    if (!loading && error) {
      Alert.alert('Erreur', error);
    }
  }, [loading, success, error]);

  /**
   * Valide le format de base d'une adresse email
   * @param {string} email - L'adresse email à valider
   * @returns {boolean} - true si l'email est valide, false sinon
   */
  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };


  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Bouton retour pour revenir à l'écran précédent */}
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
          <Title text={'Réinitilisation du mot de passe'} />

          {/* Formulaire de saisie d'email */}
          <View style={styles.formContainer}>
            {/* Champ de saisie email */}
            <FormInput
              label="Adresse mail"
              value={email}
              onChangeText={setEmail}
              placeholder="email@exemple.com"
              keyboardType="email-address"
            />

            {/* Bouton de soumission */}
            <SubmitButton
              title="Réinitialiser mot de passe"
              onPress={handleResetPassword}
            />
          </View>
        </ScrollView>

        {/* Modal de chargement qui s'affiche pendant l'envoi de l'email */}
        <Modal
          visible={loading}
          transparent
          animationType="fade"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.modalText}>Envoie du code de réinitialisation en cours...</Text>
            </View>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

/**
 * Styles pour l'écran de récupération de mot de passe
 */
const styles = StyleSheet.create({
  // Zone sécurisée qui évite les notches et autres éléments système
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  // Conteneur principal qui remplit tout l'écran
  container: {
    flex: 1,
  },
  // Contenu défilable avec marge inférieure
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
  // Conteneur du logo centré en haut
  logoContainer: {
    alignItems: 'center',
    marginTop: 35,
  },
  // Style alternatif pour le logo (non utilisé mais conservé pour référence)
  logo: {
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  // Conteneur du formulaire avec marges horizontales
  formContainer: {
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 20,
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