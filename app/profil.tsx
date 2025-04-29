import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colorButtonFirst, colorButtonThird, colorFourth } from './style/styles';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Navigation } from "@/components/NavBar/Navigation";
import { Title } from '@/components/Title';
import InputField from '@/app/components/Form/InputField'; // Import de InputField
import SubmitButton from '@/app/components/Form/SubmitButton'; // Import de SubmitButton

export default function ProfileScreen() {
  const [userData, setUserData] = useState({
    pseudo: 'Utilisateur123',
    email: 'email@exemple.com',
    phone: '06 12 34 56 78',
    password: '••••••••',
    childrenCount: 2,
    childrenAges: 5,
    reviewsCount: 10,
  });

  const handlePasswordChange = () => {
    alert('Redirection vers la page de changement de mot de passe');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu />
      <Title text={'Mon Profil'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.formContainer}>
            {/* Pseudonyme */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pseudonyme</Text>
              <InputField value={userData.pseudo} editable={false} />
            </View>

            {/* Mot de passe */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <InputField value={userData.password} editable={false} secureTextEntry />
            </View>

            {/* Email */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adresse e-mail</Text>
              <InputField value={userData.email} editable={false} />
            </View>

            {/* Téléphone */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Téléphone</Text>
              <InputField value={userData.phone} editable={false} />
            </View>

            {/* Nombre d'enfants */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre d'enfants</Text>
              <InputField value={userData.childrenCount.toString()} editable={false} />
            </View>

            {/* Âge des enfants */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Âge des enfants</Text>
              <Text style={styles.sliderValue}>{userData.childrenAges} ans</Text>
            </View>

            {/* Nombre d'avis */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre d'avis rédigés</Text>
              <InputField value={userData.reviewsCount.toString()} editable={false} />
            </View>

            {/* Bouton pour changer le mot de passe */}
            <SubmitButton onPress={handlePasswordChange} title="Changer de mot de passe" />
          </View>
        </View>
      </ScrollView>
      <Navigation />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
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
  sliderValue: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
});
