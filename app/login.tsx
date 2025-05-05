import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
  View
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';

// Composants
import { BackButton } from './components/BackButton';
import { AppLogo } from './components/AppLogo';
import { FormInput } from './components/Form/InputField';
import { AuthButton } from './components/Form/MainButton';
import { AuthSeparator } from './components/Form/SeparatorWithText ';
import { GoogleAuthButton } from './components/Form/GoogleLoginButton';
import { AuthFooterLink } from './components/InlineLink';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);

  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    androidClientId: 'VOTRE_CLIENT_ID_ANDROID',
    iosClientId: 'VOTRE_CLIENT_ID_IOS',
    webClientId: 'VOTRE_CLIENT_ID_WEB',
  });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const token = googleResponse.authentication?.accessToken;
      handleGoogleSignIn(token);
    }
  }, [googleResponse]);

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailLogin = () => {
    const { email, password } = credentials;
    if (!email || !password) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/main');
    }, 1500);
  };

  const handleGoogleSignIn = async (token?: string) => {
    if (!token) return;

    try {
      setIsLoading(true);
      const res = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const user = await res.json();
      if (user) router.replace('/main');
    } catch {
      Alert.alert('Erreur', 'Échec de la connexion avec Google');
    } finally {
      setIsLoading(false);
    }
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
            <AppLogo size={120} style={styles.logo} />
          </View>

          <View style={styles.content}>
            <FormInput
              label="Adresse mail"
              value={credentials.email}
              onChangeText={text => handleInputChange('email', text)}
              placeholder="email@exemple.com"
              keyboardType="email-address"
              autoCapitalize="none"
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
              loading={isLoading}
            />

            <AuthFooterLink
              text="Mot de passe oublié ?"
              onPress={() => router.push('/forgotpassword')}
              style={styles.forgotPasswordLink}
            />

            <AuthSeparator text="ou" />

          {/* 
<GoogleAuthButton
    // onPress={() => googlePromptAsync()}
    // loading={isLoading}
    // disabled={!googleRequest || isLoading}
/> 
*/}


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
  logo: {
    alignSelf: 'center',
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
