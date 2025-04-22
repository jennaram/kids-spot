import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Image,
  SafeAreaView,
  ScrollView
} from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { router } from 'expo-router';
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth, fontSubtitle } from './style/styles';
import { fontTitle, loadFonts } from './style/styles';

const googleLogo = require('../assets/images/google-logo.png');
const appLogo = require('../assets/images/Logo.png');

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
            {/* Logo Kids Spot */}
            <View style={styles.logoContainer}>
              <Image
                source={appLogo}
                style={styles.logo}
              />
            </View>

            {/* Champs de connexion */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adresse mail</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(t) => handleChange('email', t)}
                keyboardType="email-address"
                placeholder="email@exemple.com"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                value={formData.password}
                onChangeText={(t) => handleChange('password', t)}
                secureTextEntry
                placeholder="••••••••"
              />
            </View>

            {/* Bouton de connexion */}
            <TouchableOpacity
              style={[styles.loginButton, loading && styles.disabledButton]}
              onPress={handleLogin}
              disabled={loading}
            >
              <Text style={styles.loginButtonText}>
                {loading ? 'Connexion...' : 'Connexion'}
              </Text>
            </TouchableOpacity>

            {/* Lien mot de passe oublié */}
            <TouchableOpacity 
              style={styles.forgotPasswordButton}
              onPress={() => router.push('/forgotpassword')}
            >
              <Text style={styles.forgotPasswordText}>Mot de passe oublié ?</Text>
            </TouchableOpacity>

            {/* Séparateur */}
            <View style={styles.separatorContainer}>
              <View style={styles.separatorLine} />
              <Text style={styles.separatorText}>ou</Text>
              <View style={styles.separatorLine} />
            </View>

            {/* Bouton Google */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={() => promptAsync()}
              disabled={!request || loading}
            >
              <View style={styles.googleButtonContent}>
                <Image
                  source={googleLogo}
                  style={styles.googleLogo}
                />
                <Text style={styles.googleButtonText}>
                  {loading ? 'Connexion...' : 'Continuer avec Google'}
                </Text>
              </View>
            </TouchableOpacity>

            {/* Lien inscription */}
            <View style={styles.signupContainer}>
              <Text style={styles.signupText}>Vous n'avez pas de compte ? </Text>
              <TouchableOpacity onPress={() => router.push('/registration')}>
                <Text style={styles.signupLink}>Inscrivez-vous</Text>
              </TouchableOpacity>
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
  logoContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  inputGroup: {
    marginBottom: 20,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
    fontWeight: '500',
  },
  input: {
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  loginButton: {
    height: 50,
    backgroundColor: colorButtonFirst,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  forgotPasswordButton: {
    alignSelf: 'center',
    marginBottom: 30,
  },
  forgotPasswordText: {
    color: '#555',
    fontSize: 14,
  },
  separatorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 20,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    width: 50,
    textAlign: 'center',
    color: '#999',
    fontSize: 14,
  },
  googleButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    justifyContent: 'center',
    marginBottom: 20,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
  },
  signupText: {
    color: '#555',
    fontSize: 14,
  },
  signupLink: {
    color: colorButtonFirst,
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.7,
  },
});