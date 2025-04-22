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
  Pressable,
  Alert
} from 'react-native';
import { router } from 'expo-router';
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth, fontSubtitle } from './style/styles';
import { fontTitle, loadFonts } from './style/styles';


const appLogo = require('../assets/images/Logo.png');
const backArrow = require('../assets/images/fleche_retour.png');

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

  const handleGoBack = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Bouton de retour */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleGoBack}
      >
        <Image source={backArrow} style={styles.backButtonImage} />
      </TouchableOpacity>
      
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
              <Pressable 
                style={styles.closeButton} 
                onPress={closeModalAndRedirect}
              >
                <Text style={styles.closeButtonText}>×</Text>
              </Pressable>

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
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 5,
  },
  closeButtonText: {
    fontSize: 24,
    color: '#555',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: colorButtonFirst,
    borderRadius: 5,
    paddingVertical: 12,
    paddingHorizontal: 30,
    elevation: 2,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  // Styles pour le bouton retour
  backButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 10,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
  },
  backButtonImage: {
    width: 20,
    height: 20,
    resizeMode: 'contain',
  },
});