import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
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
import { colorButtonFirst, colorButtonThird, colorFourth } from './style/styles';
import { fontTitle } from './style/styles';
import BackButton from "./components/BackButton";
import GoogleAuthButton from "./components/Form/GoogleLoginButton";
import FormInput from "./components/Form/InputField";
import SubmitButton from "./components/Form/SubmitButton";
import FormSeparator from "./components/Form/FormSeparator";

// Initialisation des services
WebBrowser.maybeCompleteAuthSession();

export default function RegistrationScreen({ navigation }: { navigation: any }) {
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
            
            <GoogleAuthButton 
              onPress={() => promptAsync()} 
              loading={loading} 
              disabled={!request || loading} 
            />

            <FormSeparator />

            <View style={styles.formContainer}>
              <FormInput
                label="Pseudo"
                value={formData.pseudo}
                onChangeText={(t) => handleChange('pseudo', t)}
                placeholder="Votre pseudo"
              />

              <FormInput
                label="Email"
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

              <FormInput
                label="Confirmation"
                value={formData.confirmPassword}
                onChangeText={(t) => handleChange('confirmPassword', t)}
                placeholder="••••••••"
                secureTextEntry
              />

              <FormInput
                label="Téléphone"
                value={formData.phone}
                onChangeText={(t) => handleChange('phone', t)}
                placeholder="06 12 34 56 78"
                keyboardType="phone-pad"
              />

              <SubmitButton
                title="S'inscrire"
                onPress={handleSignUp}
                loading={loading}
              />
            </View>
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