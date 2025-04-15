import React, { useState } from 'react';
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
  Dimensions,
  ScrollView,
  SafeAreaView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Slider from '@react-native-community/slider';

const { width } = Dimensions.get('window');

export default function LoginScreen({ navigation }: { navigation: any }) {
  const [formData, setFormData] = useState({
    pseudo: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    childrenCount: '',
    minAge: 0,
    maxAge: 18,
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string | number) => {
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
      Alert.alert('Succès', 'Inscription réussie! Vérifiez votre email');
    }, 1500);
  };

  const handleGoogleSignIn = () => {
    Alert.alert('Google Sign-In', 'Fonctionnalité à implémenter');
  };

  // Utiliser cette fonction pour la navigation si vous utilisez Expo Router
  const handleGoBack = () => {
    if (navigation) {
      navigation.goBack();
    } else {
      // Fallback si la navigation n'est pas disponible
      Alert.alert('Navigation', 'Retour à l\'écran précédent');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {/* Bouton Retour */}
        <TouchableOpacity 
          style={styles.backButton}
          onPress={handleGoBack}
        >
          <Ionicons name="arrow-back" size={24} color="#D37230" />
        </TouchableOpacity>

        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.content}>
            <Text style={styles.title}>Inscription</Text>

            {/* Bouton Google amélioré */}
            <TouchableOpacity
              style={styles.googleButton}
              onPress={handleGoogleSignIn}
              activeOpacity={0.8}
            >
              <View style={styles.googleIconContainer}>
                <Image
                  source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg' }}
                  style={styles.googleIcon}
                />
              </View>
              <Text style={styles.googleButtonText}>Continuer avec Google</Text>
            </TouchableOpacity>

            <Text style={styles.separatorText}>ou</Text>

            {/* Formulaire centré */}
            <View style={styles.formContainer}>
              {/* Pseudo et Email */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Pseudo</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Pseudo"
                  value={formData.pseudo}
                  onChangeText={(text) => handleChange('pseudo', text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Email"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                />
              </View>

              {/* Mot de passe et confirmation */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Mot de passe</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Mot de passe"
                  secureTextEntry
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Confirmation</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Confirmez"
                  secureTextEntry
                  value={formData.confirmPassword}
                  onChangeText={(text) => handleChange('confirmPassword', text)}
                />
              </View>

              {/* Téléphone et Nombre d'enfants */}
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Téléphone</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Téléphone"
                  value={formData.phone}
                  onChangeText={(text) => handleChange('phone', text)}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nombre d'enfants</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Nombre"
                  value={formData.childrenCount}
                  onChangeText={(text) => handleChange('childrenCount', text)}
                  keyboardType="numeric"
                />
              </View>

              {/* Sliders pour les âges */}
              <View style={styles.ageSection}>
                <Text style={styles.label}>Âge des enfants</Text>
                
                <View style={styles.ageSlider}>
                  <Text style={styles.ageText}>Min: {formData.minAge} ans</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={18}
                    step={1}
                    value={formData.minAge}
                    onValueChange={(value) => handleChange('minAge', value)}
                    minimumTrackTintColor="#D37230"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#D37230"
                  />
                </View>

                <View style={styles.ageSlider}>
                  <Text style={styles.ageText}>Max: {formData.maxAge} ans</Text>
                  <Slider
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={18}
                    step={1}
                    value={formData.maxAge}
                    onValueChange={(value) => handleChange('maxAge', value)}
                    minimumTrackTintColor="#D37230"
                    maximumTrackTintColor="#ddd"
                    thumbTintColor="#D37230"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={styles.signUpButton}
                onPress={handleSignUp}
                disabled={loading}
              >
                <Text style={styles.signUpButtonText}>
                  {loading ? 'Traitement...' : 'Valider l\'inscription'}
                </Text>
              </TouchableOpacity>
            </View>
            
            {/* Espace supplémentaire en bas pour le scrolling */}
            <View style={styles.bottomPadding} />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    left: 20,
    zIndex: 10,
    padding: 10,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 80,
    paddingHorizontal: 20,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
    marginBottom: 25,
  },
  googleButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 10,
    padding: 12,
    marginBottom: 20,
    width: '90%',
    maxWidth: 320,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.5,
    elevation: 2,
  },
  googleIconContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 2,
    marginRight: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },
  googleIcon: {
    width: 22,
    height: 22,
  },
  googleButtonText: {
    fontSize: 16,
    color: '#444',
    fontWeight: '600',
  },
  separatorText: {
    textAlign: 'center',
    color: '#999',
    marginVertical: 15,
    fontSize: 16,
  },
  formContainer: {
    width: '90%',
    maxWidth: 320,
    alignItems: 'center',
  },
  inputContainer: {
    marginBottom: 15,
    width: '100%',
  },
  label: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    fontWeight: '500',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    backgroundColor: 'white',
    fontSize: 15,
    width: '100%',
  },
  ageSection: {
    marginTop: 10,
    marginBottom: 20,
    width: '100%',
  },
  ageSlider: {
    marginBottom: 15,
    width: '100%',
  },
  ageText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
  },
  slider: {
    width: '100%',
    height: 40,
  },
  signUpButton: {
    backgroundColor: '#D37230',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  signUpButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bottomPadding: {
    height: 30,
  }
});