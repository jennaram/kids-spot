import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { colorButtonFirst, colorButtonThird, colorFourth, colorButtonSecondary } from './style/styles';
import { fontTitle } from './style/styles';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Navigation } from "@/components/NavBar/Navigation";
import { Title } from '@/components/Title';
import AgeBadges from '@/components/Lieux/AgeBadges';
import InputField from '@/app/components/Form/InputField'; // Import du composant InputField
import SubmitButton from '@/app/components/Form/SubmitButton'; // Import du composant SubmitButton

export default function ProfileScreen() {
  const [userData, setUserData] = useState({
    pseudo: 'Utilisateur123',
    email: 'email@exemple.com',
    phone: '06 12 34 56 78',
    password: '••••••••',
    childrenCount: 2,
    childrenAges: '5,7,10', // Exemple d'âge des enfants sous forme de chaîne
    reviewsCount: 10,
  });

  const [loading, setLoading] = useState(false);

  const handlePasswordChange = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Redirection vers la page de changement de mot de passe');
    }, 2000);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu />
      <Title text={'Mon Profil'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.formContainer}>
            {/* Remplacement des TextInput par InputField */}
            <InputField
              label="Pseudonyme"
              value={userData.pseudo}
              onChangeText={(text) => setUserData({ ...userData, pseudo: text })}
              placeholder="Entrez votre pseudonyme"
              
            />

            <InputField
              label="Mot de passe"
              value={userData.password}
              onChangeText={(text) => setUserData({ ...userData, password: text })}
              placeholder="••••••••"
              secureTextEntry
              
            />

            <InputField
              label="Adresse e-mail"
              value={userData.email}
              onChangeText={(text) => setUserData({ ...userData, email: text })}
              placeholder="email@exemple.com"
              keyboardType="email-address"
              
            />

            <InputField
              label="Téléphone"
              value={userData.phone}
              onChangeText={(text) => setUserData({ ...userData, phone: text })}
              placeholder="06 12 34 56 78"
              keyboardType="phone-pad"
              
            />

            <InputField
              label="Nombre d'enfants"
              value={userData.childrenCount.toString()}
              onChangeText={(text) => setUserData({ ...userData, childrenCount: parseInt(text) })}
              placeholder="Nombre d'enfants"
              keyboardType="numeric"
              
            />

            {/* Remplacement de l'affichage de l'âge des enfants par AgeBadges */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Âge des enfants</Text>
              <AgeBadges 
                tranchesAge={userData.childrenAges ? userData.childrenAges.split(',') : []}
                badgeColor={colorButtonThird}
                containerStyle={styles.ageContainerStyle}
                badgeStyle={styles.ageBadgeStyle}
                textStyle={styles.ageBadgeTextStyle}
              />
            </View>

            <InputField
              label="Nombre d'avis rédigés"
              value={userData.reviewsCount.toString()}
              onChangeText={(text) => setUserData({ ...userData, reviewsCount: parseInt(text) })}
              placeholder="Nombre d'avis"
              keyboardType="numeric"
              
            />

            {/* Bouton "Changer de mot de passe" */}
            <SubmitButton
              title="Changer de mot de passe"
              onPress={handlePasswordChange}
              loading={loading}
            />
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
  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
    fontWeight: '500',
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
  ageContainerStyle: {
    marginBottom: 25,
  },
  ageBadgeStyle: {
    backgroundColor: '#007BFF', // couleur bleue pour les badges d'âge
  },
  ageBadgeTextStyle: {
    color: 'white',
  },

  inputGroup: {
    marginBottom: 15,
  },
});
