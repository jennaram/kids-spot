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
import { colorButtonFirst } from './style/styles';

// Composants
import AuthHeader from './components/LogoHeader';
import FormInput from './components/Form/InputField';
import AuthButton from './components/Form/MainButton';
import AuthFooterLink from './components/InlineLin';
import AuthSeparator from './components/Form/SeparatorWithText ';
import GoogleAuthButton from './components/Form/GoogleLoginButton';

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "VOTRE_CLIENT_ID_ANDROID",
    iosClientId: "VOTRE_CLIENT_ID_IOS",
    webClientId: "VOTRE_CLIENT_ID_WEB",
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  const getUserInfo = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = await response.json();
      if (userData) {
        router.replace('/points');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleLogin = () => {
    setLoading(true);
    // Ici vous ajouteriez votre logique de connexion
    setTimeout(() => {
      setLoading(false);
      router.replace('/main');
    }, 1500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <AuthHeader />

            <FormInput
              label="Adresse mail"
              value={formData.email}
              onChangeText={(t) => handleChange('email', t)}
              placeholder="email@exemple.com"
              keyboardType="email-address"
            />

            <FormInput
              label="Mot de passe"
              value={formData.password}
              onChangeText={(t) => handleChange('password', t)}
              placeholder="••••••••"
              secureTextEntry
            />

            <AuthButton
              title="Connexion"
              onPress={handleLogin}
              loading={loading}
            />

            <AuthFooterLink
              text="Mot de passe oublié ?"
              onPress={() => router.push('/forgotpassword')}
            />

            <AuthSeparator />

            <GoogleAuthButton
              onPress={() => promptAsync()}
              loading={loading}
              disabled={!request || loading}
            />

            <AuthFooterLink
              text="Vous n'avez pas de compte ?"
              linkText="Inscrivez-vous"
              onPress={() => router.push('/registration')}
            />
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
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    justifyContent: 'center',
  },
});