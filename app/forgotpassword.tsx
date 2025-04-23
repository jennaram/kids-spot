import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image
} from 'react-native';
import { router } from 'expo-router';
import { colorButtonFirst } from './style/styles';
import BackButton from "./components/BackButton";
import FormInput from "./components/Form/InputField";
import SubmitButton from "./components/Form/SubmitButton";
import ConfirmationModal from "./components/Form/AlertPopUp";
const appLogo = require('../assets/images/Logo.png');

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleResetPassword = () => {
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
          <Image source={appLogo} style={styles.logo} />

          <View style={styles.formContainer}>
            <FormInput
              label="Adresse mail"
              value={email}
              onChangeText={setEmail}
              placeholder="email@exemple.com"
              keyboardType="email-address"
              // autoCapitalize is removed as it is not supported by FormInput
            />

            <SubmitButton
              title="Réinitialiser mot de passe"
              onPress={handleResetPassword}
            />
          </View>
        </ScrollView>

        <ConfirmationModal
          visible={showConfirmation}
          email={email}
          onClose={closeModalAndRedirect}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
  },
  logo: {
    width: 150,
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
})