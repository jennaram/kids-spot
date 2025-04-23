import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colorButtonFirst, colorButtonThird, colorFourth } from './style/styles';
import { fontTitle } from './style/styles';
import MenuBurger from './components/menuburger';

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
      {/* Menu burger */}
      <View style={styles.header}>
        <MenuBurger />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Titre centré */}
          <Text style={[fontTitle, styles.title]}>Mon Profil</Text>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Pseudonyme</Text>
              <TextInput
                style={styles.input}
                value={userData.pseudo}
                editable={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Mot de passe</Text>
              <TextInput
                style={styles.input}
                value={userData.password}
                editable={false}
                secureTextEntry
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Adresse e-mail</Text>
              <TextInput
                style={styles.input}
                value={userData.email}
                editable={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Téléphone</Text>
              <TextInput
                style={styles.input}
                value={userData.phone}
                editable={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre d'enfants</Text>
              <TextInput
                style={styles.input}
                value={userData.childrenCount.toString()}
                editable={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Âge des enfants</Text>
              <Text style={styles.sliderValue}>
                {userData.childrenAges} ans
              </Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nombre d'avis rédigés</Text>
              <TextInput
                style={styles.input}
                value={userData.reviewsCount.toString()}
                editable={false}
              />
            </View>

            <TouchableOpacity
              style={styles.submitButton}
              onPress={handlePasswordChange}
            >
              <Text style={styles.submitButtonText}>Changer de mot de passe</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  header: {
    paddingHorizontal: 15,
    paddingVertical: 10,
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
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
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
  input: {
    height: 50,
    backgroundColor: colorButtonThird,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
  },
  sliderValue: {
    textAlign: 'center',
    marginTop: 5,
    fontSize: 16,
    color: '#333',
  },
  submitButton: {
    height: 50,
    backgroundColor: colorButtonFirst,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: colorButtonThird,
    fontSize: 16,
    fontWeight: '600',
  },
});