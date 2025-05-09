import React, { useEffect, useState } from 'react';
import {
  SafeAreaView,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Alert,
  StyleSheet,
  View
} from 'react-native';
import { router } from 'expo-router';
import { colorButtonFirst } from '../style/styles';

// Composants optimisés
import { BackButton } from '../components/BackButton';
import { FormInput } from '../components/Form/InputField';
import { SubmitButton } from '../components/Form/SubmitButton';
import { ConfirmationModal } from '../components/Form/AlertPopUp';
import { AppLogo } from '../components/AppLogo';
import { useSendMAil } from '@/hooks/user/useSendMail';


export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const { send, loading, success, error } = useSendMAil()

  const handleResetPassword = () => {
    if (!validateEmail(email)) {
      Alert.alert('Erreur', 'Veuillez entrer une adresse email valide');
      return;
    }

    send(email);

  };

  useEffect(() => {
    if (!loading && success) {
      setShowConfirmation(true);
    }

    if (!loading && error) {
      Alert.alert('Erreur', 'Une erreur est survenue lors de l’envoi de l’email.');
    }
  }, [loading, success, error]);


  const validateEmail = (email: string) => {
    return email.includes('@') && email.includes('.');
  };

  const closeModal = () => {
    setShowConfirmation(false);
    router.push({
      pathname: '/sendResetCode',
      params: { mail: email },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton onPress={() => router.back()} style={styles.backButton} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo centré en haut avec espacement */}
          <View style={styles.logoContainer}>
            <AppLogo size={150} />
          </View>


          <View style={styles.formContainer}>
            <FormInput
              label="Adresse mail"
              value={email}
              onChangeText={setEmail}
              placeholder="email@exemple.com"
              keyboardType="email-address"
            />

            <SubmitButton
              title="Réinitialiser mot de passe"
              onPress={handleResetPassword}
              loading={loading}
            />
          </View>
        </ScrollView>

        <ConfirmationModal
          visible={showConfirmation}
          email={email}
          onClose={closeModal}
          title="Email envoyé"
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
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
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
    marginTop: 40,
    marginBottom: 30,
  },
  logo: {
    alignSelf: 'center',
    marginTop: 40,
    marginBottom: 30,
  },
  formContainer: {
    width: '100%',
    paddingHorizontal: 25,
    marginTop: 20,
  },
});