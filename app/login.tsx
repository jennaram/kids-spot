import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/context/auth/AuthContext'; // Import du context
import { useLoginUser } from '@/hooks/user/useLoginUser'; // Import du hook

import { BackButton } from './components/BackButton';
import { AppLogo } from './components/AppLogo';
import { FormInput } from './components/Form/InputField';
import { AuthButton } from './components/Form/MainButton';
import { AuthSeparator } from './components/Form/SeparatorWithText ';
import { AuthFooterLink } from './components/InlineLink';
import GoogleAuthButton from './components/Form/GoogleLoginButton';

export default function LoginScreen() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const { setToken } = useAuth(); // Accès au setToken du contexte

  // Utilisation du hook useLoginUser
  const { submit, loading, data, error, fieldErrors } = useLoginUser();

  // Effet pour gérer la connexion réussie
  useEffect(() => {
    if (data?.token) {
      setToken(data.token, data.expiresIn * 1000); // Convertir expiresIn en ms
      Alert.alert('Succès', 'Connexion réussie');
      router.replace('/main'); // Redirection après succès
    }
  }, [data, setToken]);

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailLogin = async () => {
    const { email, password } = credentials;

    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    // Appeler le hook submit pour se connecter
    await submit(email, password);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContainer}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoContainer}>
            <AppLogo size={120} />
          </View>

          <View style={styles.content}>
            <FormInput
              label="Adresse mail"
              value={credentials.email}
              onChangeText={text => handleInputChange('email', text)}
              placeholder="email@exemple.com"
              keyboardType="email-address"
            />

            <FormInput
              label="Mot de passe"
              value={credentials.password}
              onChangeText={text => handleInputChange('password', text)}
              placeholder="••••••••"
              secureTextEntry
            />

            <AuthButton
              title="Connexion"
              onPress={handleEmailLogin}
              loading={loading || isLoading} // Afficher loading si en cours
            />

            

            <AuthFooterLink
              text="Mot de passe oublié ?"
              onPress={() => router.push('/forgotpassword')}
            />

            <AuthSeparator text="ou" />

            <GoogleAuthButton
              onPress={() => googlePromptAsync()} // Connexion Google
              loading={loading || isLoading}
              //disabled={!googleRequest || isLoading}
            />

            <View style={styles.signUpContainer}>
              <AuthFooterLink
                text="Vous n'avez pas de compte ?"
                linkText="Inscrivez-vous"
                onPress={() => router.push('/registration')}
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
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  backButton: {
    position: 'absolute',
    top: Platform.select({ ios: 50, android: 30 }),
    left: 20,
    zIndex: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  logoContainer: {
    marginTop: 40,
    marginBottom: 20,
    alignItems: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  forgotPasswordLink: {
    alignSelf: 'center',
    marginVertical: 15,
  },
  signUpContainer: {
    marginTop: 20,
    justifyContent: 'center',
  },
});