import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Types pour les props des composants
interface BackButtonProps {
  style?: object; // Définir le style directement au lieu de containerStyle
}

interface InputFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  keyboardType?: string;
  autoCapitalize?: string;
  secureTextEntry?: boolean;
}

interface MainButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean; // Renommé de isLoading à loading
}

interface InLineLinkProps {
  text: string;
  linkText?: string;
  onPress: () => void;
  style?: object;
}

interface GoogleLoginButtonProps {
  onPress: () => void;
  loading?: boolean; // Renommé de isLoading à loading
  disabled?: boolean; // Renommé de isDisabled à disabled
}

// Composants
import BackButton from './components/BackButton';
import LogoHeader from './components/LogoHeader';
import InputField from './components/Form/InputField';
import MainButton from './components/Form/MainButton';
import InLineLink from './components/InlineLink';
import FormSeparator from './components/Form/FormSeparator';
import GoogleLoginButton from './components/Form/GoogleLoginButton';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);

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

  const handleGoogleSignIn = async (token?: string) => {
    if (!token) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = await response.json();
      if (userData) router.replace('/points');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la connexion avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setCredentials(prev => ({ ...prev, [field]: value }));
  };

  const handleEmailLogin = async () => {
    setIsLoading(true);
  
    try {
      const response = await fetch('https://seb-prod.alwaysdata.net/kidsspot/users/login.php', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
  
      const data = await response.json();
  
      if (data.success && data.token) {
        // Stocker le token localement
        await AsyncStorage.setItem('userToken', data.token);
  
        Alert.alert("Succès", "Connexion réussie !");
        router.replace('/main'); // Redirection vers la page principale
      } else {
        Alert.alert("Erreur", data.message || "Email ou mot de passe incorrect.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de se connecter.");
      console.error("Login error", error);
    } finally {
      setIsLoading(false);
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={styles.backButtonContainer} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            <LogoHeader />

            <InputField
              label="Adresse mail"
              value={credentials.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="email@exemple.com"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <InputField
              label="Mot de passe"
              value={credentials.password}
              onChangeText={(text) => handleInputChange('password', text)}
              placeholder="••••••••"
              secureTextEntry
            />

            <MainButton
              title="Connexion"
              onPress={handleEmailLogin}
              loading={isLoading} // Renommé de isLoading à loading
            />

            <InLineLink
              text="Mot de passe oublié ?"
              onPress={() => router.push('/forgotpassword')}
              style={styles.forgotPasswordLink}
            />

            <FormSeparator />

            <GoogleLoginButton
              onPress={() => googlePromptAsync()}
              loading={isLoading} // Renommé de isLoading à loading
              disabled={!googleRequest || isLoading} // Renommé de isDisabled à disabled
            />

            <View style={styles.signUpContainer}>
              <InLineLink
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
  backButtonContainer: {
    position: 'absolute',
    top: Platform.select({ ios: 50, android: 30 }),
    left: 20,
    zIndex: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
  forgotPasswordLink: {
    alignSelf: 'center',
    marginVertical: 15,
  },
  signUpContainer: {
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
  },
});