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

const googleLogo = require('../assets/images/google-logo.png');
const appLogo = require('../assets/images/Logo.png');

WebBrowser.maybeCompleteAuthSession();

export default function LoginScreen({ navigation }: { navigation: any }) {
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
        navigation?.navigate('points') || router.replace('/points');
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
      // navigation.navigate('Home');
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
            <TouchableOpacity style={styles.forgotPasswordButton}>
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
    backgroundColor: '#D37230',
    borderRadius: 25,
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
    color: '#D37230',
    fontSize: 14,
    fontWeight: '500',
  },
  disabledButton: {
    opacity: 0.7,
  },
});import { Image, Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';

export default function LoginPage() {
  const router = useRouter();
  
  const handleGoogleLogin = async () => {
    // Implémentez votre logique de connexion Google ici
    console.log("Connexion Google");
    // Exemple avec Firebase:
    // try {
    //   await GoogleSignin.signIn();
    //   router.push('/main');
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/images/Logo.png')}
        style={styles.logo}
      />
      
      {/* Formulaire de connexion */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adresse mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={true}
        />
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/main')}
        >
          <Text style={styles.loginButtonText}>Connexion</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/password-reset')}>
          <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        {/* Séparateur */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Bouton Google */}
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleGoogleLogin}
        >
          <Image
            source={require('../assets/images/google-icon.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Continuer avec Google</Text>
        </TouchableOpacity>
      </View>
      
      {/* Lien vers l'inscription */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Pas encore de compte ? </Text>
        <TouchableOpacity onPress={() => router.push('/registration')}>
          <Text style={styles.signupLink}>Inscrivez-vous !</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#D37230',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  googleButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#333',
    fontSize: 16,
  },
  signupLink: {
    color: '#D37230',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});