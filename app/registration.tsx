import React, { useState } from 'react';
import { 
  View, 
  StyleSheet, 
  ScrollView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  Text,
  TouchableOpacity
} from 'react-native';
import { router } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';

// Composants
import { AppLogo } from './components/AppLogo';
import { BackButton } from './components/BackButton';
import { FormInput } from './components/Form/InputField';
import { AuthButton } from './components/Form/MainButton';
import { AuthSeparator } from './components//Form/SeparatorWithText ';
import { GoogleAuthButton } from './components/Form/GoogleLoginButton';



// Initialisation de WebBrowser pour l'authentification Google
WebBrowser.maybeCompleteAuthSession();

export default function RegistrationScreen() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  
  // Configuration de l'authentification Google
  const [googleRequest, googleResponse, googlePromptAsync] = Google.useAuthRequest({
    androidClientId: "VOTRE_CLIENT_ID_ANDROID",
    iosClientId: "VOTRE_CLIENT_ID_IOS",
    webClientId: "VOTRE_CLIENT_ID_WEB",
  });

  // Gestion des changements de formulaire
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Inscription par email
  const handleRegister = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    setIsLoading(true);
    
    // Simulation d'inscription
    setTimeout(() => {
      setIsLoading(false);
      router.replace('/main');
    }, 1500);
  };

  // Connexion Google
  React.useEffect(() => {
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
      if (userData) router.replace('/main');
    } catch (error) {
      Alert.alert('Erreur', 'Échec de la connexion avec Google');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton onPress={() => router.back()} style={styles.backButton} />
      
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo centré en haut */}
          <View style={styles.logoContainer}>
            <AppLogo size={120} />
          </View>

          {/* Formulaire d'inscription */}
          <View style={styles.formContainer}>
            <FormInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => handleInputChange('email', text)}
              placeholder="Entrez votre email"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <FormInput
              label="Mot de passe"
              value={formData.password}
              onChangeText={(text) => handleInputChange('password', text)}
              placeholder="Créez un mot de passe"
              secureTextEntry
            />

            <FormInput
              label="Confirmez le mot de passe"
              value={formData.confirmPassword}
              onChangeText={(text) => handleInputChange('confirmPassword', text)}
              placeholder="Confirmez votre mot de passe"
              secureTextEntry
            />

            {/* Bouton d'inscription */}
            <AuthButton
              title="S'inscrire"
              onPress={handleRegister}
              loading={isLoading}
            />

            {/* Séparateur */}
            <AuthSeparator text="ou" />

            {/* Bouton Google */}
            <GoogleAuthButton
              onPress={() => googlePromptAsync()}
              loading={isLoading}
              disabled={!googleRequest || isLoading}
            />

            {/* SOLUTION SIMPLIFIÉE: Zone cliquable "Connectez-vous" */}
            <View style={styles.loginLinkContainer}>
              <Text style={styles.footerText}>
                Déjà un compte ? {' '}
                <Text 
                  style={styles.footerLink}
                  onPress={() => {
                    try {
                      router.push('/login');
                    } catch (error) {
                      console.log("Erreur de navigation:", error);
                      try {
                        router.replace('/login');
                      } catch (error2) {
                        console.log("Seconde erreur:", error2);
                      }
                    }
                  }}
                >
                  Connectez-vous
                </Text>
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingBottom: 40,
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 10,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 70,
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
  },
  loginLinkContainer: {
    marginTop: 20,
    alignItems: 'center',
    paddingVertical: 10, // Agrandit la zone cliquable verticalement
  },
  footerText: {
    color: '#666',
    fontSize: 14,
    textAlign: 'center',
  },
  footerLink: {
    color: 'orange',
    fontWeight: '600',
    fontSize: 14,
  },
});