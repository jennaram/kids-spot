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
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import { colorButtonThird, colorFourth } from './style/styles';
import { fontTitle } from './style/styles';

// Composants
import { BackButton } from './components/BackButton';
import { GoogleAuthButton } from './components/Form/GoogleLoginButton';
import { FormInput } from './components/Form/InputField';
import { SubmitButton } from './components/Form/SubmitButton';
import { AuthSeparator } from './components/Form/SeparatorWithText ';
import { AuthFooterLink } from './components/InlineLink';

import { useRegisterUser } from '@/hooks/user/useRegisterUser';

WebBrowser.maybeCompleteAuthSession();

export default function RegistrationScreen() {
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });

  const {
    submit,
    loading,
    success,
    error,
    fieldErrors,
  } = useRegisterUser();

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    androidClientId: "VOTRE_CLIENT_ID_ANDROID",
    iosClientId: "VOTRE_CLIENT_ID_IOS",
    webClientId: "VOTRE_CLIENT_ID_WEB",
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      handleGoogleSignIn(googleResponse.authentication?.accessToken);
    }
  }, [googleResponse]);

  useEffect(() => {
    if (success) {
      Alert.alert('Succès', 'Inscription réussie !');
      router.replace('/accueil');
    } else if (error) {
      console.log(fieldErrors);
      if (fieldErrors) {
        const errorMessages = Object.entries(fieldErrors)
          .map(([field, message]) => `${field} : ${message}`)
          .join('\n');

        Alert.alert('Erreur(s) de validation', errorMessages);
      }

    }
  }, [success, fieldErrors]);

  const handleGoogleSignIn = async (token?: string) => {
    if (!token) return;

    try {
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` }
      });

      const userData = await response.json();
      if (userData) router.replace('/points');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la connexion avec Google');
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSignUp = async () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    await submit({
      pseudo: formData.pseudo,
      mail: formData.email,
      mot_de_passe: formData.password,
      telephone: formData.phone,
    });


  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton navigateTo="/login" />

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
          <View style={styles.content}>
            <Text style={[fontTitle, styles.titleText]}>Inscription</Text>

            <GoogleAuthButton
              onPress={() => googlePromptAsync()}
              loading={loading}
              disabled={!googleRequest || loading}
            />

            <AuthSeparator text="ou" />

            <View style={styles.formContainer}>
              <FormInput
                label="Pseudo"
                value={formData.pseudo}
                onChangeText={(text) => handleInputChange('pseudo', text)}
                placeholder="Votre pseudo"
              />

              <FormInput
                label="Email"
                value={formData.email}
                onChangeText={(text) => handleInputChange('email', text)}
                placeholder="email@exemple.com"
                keyboardType="email-address"
              />

              <FormInput
                label="Mot de passe"
                value={formData.password}
                onChangeText={(text) => handleInputChange('password', text)}
                placeholder="••••••••"
                secureTextEntry
              />

              <FormInput
                label="Confirmation"
                value={formData.confirmPassword}
                onChangeText={(text) => handleInputChange('confirmPassword', text)}
                placeholder="••••••••"
                secureTextEntry
              />

              <FormInput
                label="Téléphone"
                value={formData.phone}
                onChangeText={(text) => handleInputChange('phone', text)}
                placeholder="06 12 34 56 78"
                keyboardType="phone-pad"
              />

              <SubmitButton
                title="S'inscrire"
                onPress={handleSignUp}
                loading={loading}
              />

              <AuthFooterLink
                text="Déjà un compte ?"
                linkText="Connectez-vous"
                onPress={() => router.push('/login')}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  titleText: {
    textAlign: 'center',
    marginBottom: 20,
  },
  formContainer: {
    width: '100%',
    backgroundColor: colorFourth,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});