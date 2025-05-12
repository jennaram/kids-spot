import React, { useContext, useEffect, useState } from 'react';
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
import envelopeIcon from '@expo/vector-icons'
import { AuthContext } from "@/context/auth/AuthContext";
import Checkbox from '@/components/Checkbox';
import { profilUser } from '@/services/userServices';
import { useRouter } from 'expo-router';


export default function ProfileScreen() {
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    pseudo: '',
    email: '',
    phone: '',
  });

  const [loading, setLoading] = useState(false);
  useEffect(() => {
    async function fetchProfile() {
      try {
        if (!token) {
          console.error("Token is null");
          return;
        }
        const response = await profilUser(token);
  
        const user = response?.data?.data;
  
        if (user) {
          const { pseudo, mail, telephone } = user;
  
          setUserData(prev => ({
            ...prev,
            pseudo: pseudo,
            email: mail,
            phone: telephone,
          }));
        } else {
          console.error("Données utilisateur non trouvées", response);
        }
      } catch (error) {
        console.error("Erreur API profil", error);
      }
    }
  
    if (token) {
      fetchProfile();
    }
  }, [token]);

  const router = useRouter();

  const handlePasswordChange = () => {
    router.push('/forgotpassword');
  };
  

  function setReceiveEmails(arg0: boolean): void {
    throw new Error('Function not implemented.');
  }

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

            {/* <InputField
              label="Mot de passe"
              value={userData.password}
              onChangeText={(text) => setUserData({ ...userData, password: text })}
              placeholder="••••••••"
              secureTextEntry
              
            /> */}

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

            {/* <InputField
              label="Nombre d'avis rédigés"
              value={userData.reviewsCount.toString()}
              onChangeText={(text) => setUserData({ ...userData, reviewsCount: parseInt(text) })}
              placeholder="Nombre d'avis"
              keyboardType="numeric"
              
            /> */}
            <Checkbox
              label="Recevoir des notifications par email"
              checked
              onToggle={() => setReceiveEmails}
              icon={envelopeIcon}
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


