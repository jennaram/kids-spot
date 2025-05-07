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
import InputField from '@/app/components/Form/InputField'; // Import du composant InputField
import SubmitButton from '@/app/components/Form/SubmitButton';
import { styles } from '@/app/style/profil.styles';
import { AuthContext } from "@/context/auth/AuthContext";

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
              label="Adresse mail"
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


