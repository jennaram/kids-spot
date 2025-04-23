import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Modal,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth, fontSubtitle } from './style/styles';
import { fontTitle, loadFonts } from './style/styles';
import BackButton from "./components/backButton";
import ExitButton from "./components/ExitButton";


const appLogo = require('../assets/images/Logo.png');

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleResetPassword = () => {
    // Vérification basique de l'email (vous devrez adapter cette logique)
    if (email.includes('@') && email.includes('.')) {
      setShowConfirmation(true);
    } else {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
    }
  };

  const closeModalAndRedirect = () => {
    setShowConfirmation(false);
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Bouton de retour */}
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
          {/* Logo centré */}
          <Image source={appLogo} style={styles.logo} />

          {/* Conteneur formulaire */}
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <Text style={styles.label}>Adresse mail</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                placeholder="email@exemple.com"
                placeholderTextColor="#999"
                autoCapitalize="none"
              />
            </View>

            <TouchableOpacity
              style={styles.resetButton}
              onPress={handleResetPassword}
            >
              <Text style={styles.resetButtonText}>Réinitialiser mot de passe</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Popup de confirmation */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showConfirmation}
          onRequestClose={closeModalAndRedirect}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              {/* Bouton fermeture */}
              <ExitButton onPress={closeModalAndRedirect} />

              <Text style={styles.modalTitle}>Demande envoyée</Text>
              <Text style={styles.modalText}>
                Un email de réinitialisation a été envoyé à {email} si cette adresse est reconnue.
              </Text>
              
              <TouchableOpacity
                style={styles.modalButton}
                onPress={closeModalAndRedirect}
              >
                <Text style={styles.modalButtonText}>OK</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
    alignItems: 'center',
    padding: 20,
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    maxWidth: 400,
  },
  inputContainer: {
    width: '100%',
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    color: '#555',
    marginBottom: 8,
    textAlign: 'center',
  },
  input: {
    height: 50,
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    textAlign: 'center',
  },
  resetButton: {
    height: 50,
    backgroundColor: colorButtonFirst,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  // Styles pour la modal
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContainer: {
    width: '90%',
    maxWidth: 450,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 40,
    paddingTop: 70,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    minHeight: 300,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
    marginBottom: 35,
    lineHeight: 26,
  },
  modalButton: {
    backgroundColor: colorButtonFirst,
    borderRadius: 15,
    paddingVertical: 15,
    paddingHorizontal: 40,
    elevation: 2,
    marginTop: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});