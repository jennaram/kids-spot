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
import BackButton from "./components/backButton";

// Import du logo Google
const googleLogo = require('../assets/images/google-logo.png');

// Initialisation des services
WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: { navigation: any }) {
  // ==================== STATE MANAGEMENT ====================
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  });
  const [loading, setLoading] = useState(false);
  
  // ==================== GOOGLE AUTH CONFIG ====================
  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId: "VOTRE_CLIENT_ID_ANDROID",
    iosClientId: "VOTRE_CLIENT_ID_IOS",
    webClientId: "VOTRE_CLIENT_ID_WEB",
  });

  // ==================== EFFECTS ====================
  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      if (authentication?.accessToken) {
        getUserInfo(authentication.accessToken);
      }
    }
  }, [response]);

  // ==================== API CALLS ====================
  const getUserInfo = async (token: string) => {
    try {
      setLoading(true);
      const response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const userData = await response.json();
      if (userData) {
        navigation?.navigate('points') || router.replace('/points');
      }
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la connexion avec Google');
    } finally {
      setLoading(false);
    }
  };

  // ==================== EVENT HANDLERS ====================
  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignUp = () => {
    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Succès', 'Inscription réussie!');
    }, 1500);
  };

  // ==================== RENDER METHODS ====================
  const renderGoogleButton = () => (
    <View style={styles.googleButtonWrapper}>
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
    </View>
  );

  const renderSignUpForm = () => (
    <View style={styles.formContainer}>
      <View style={styles.inputGroup}>
        <Text style={styles.label}>Pseudo</Text>
        <TextInput
          style={styles.input}
          value={formData.pseudo}
          onChangeText={(t) => handleChange('pseudo', t)}
          placeholder="Votre pseudo"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email</Text>
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

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Confirmation</Text>
        <TextInput
          style={styles.input}
          value={formData.confirmPassword}
          onChangeText={(t) => handleChange('confirmPassword', t)}
          secureTextEntry
          placeholder="••••••••"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Téléphone</Text>
        <TextInput
          style={styles.input}
          value={formData.phone}
          onChangeText={(t) => handleChange('phone', t)}
          keyboardType="phone-pad"
          placeholder="06 12 34 56 78"
        />
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.disabledButton]}
        onPress={handleSignUp}
        disabled={loading}
      >
        <Text style={styles.submitButtonText}>
          {loading ? 'En cours...' : 'S\'inscrire'}
        </Text>
      </TouchableOpacity>
    </View>
  );

  // ==================== MAIN RENDER ====================
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
        >
          <View style={styles.content}>
            <Text style={[fontTitle, styles.titleText]}>Inscription</Text>
            
            {renderGoogleButton()}

            <Text style={styles.separator}>ou</Text>

            {renderSignUpForm()}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ==================== STYLES ====================
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
  // Styles pour le bouton Google
  googleButtonWrapper: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 20,
  },
  googleButton: {
    width: '100%',
    maxWidth: 300,
    height: 50,
    backgroundColor: colorButtonThird,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 15,
    justifyContent: 'center',
    elevation: 2,
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 15,
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
  separator: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 15,
    fontSize: 16,
  },
  // Styles pour le formulaire
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
  inputGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 50,
    backgroundColor: colorButtonThird,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  submitButton: {
    height: 50,
    backgroundColor: colorButtonFirst,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  disabledButton: {
    opacity: 0.7,
  },
});