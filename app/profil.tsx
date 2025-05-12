import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Navigation } from "@/components/NavBar/Navigation";
import { Title } from '@/components/Title';
import InputField from '@/app/components/Form/InputField'; // Import du composant InputField
import SubmitButton from '@/app/components/Form/SubmitButton';
import { styles } from '@/app/style/profil.styles';
import envelopeIcon from '@expo/vector-icons'
import { AuthContext } from "@/context/auth/AuthContext";
import CheckSwitch from '@/components/Checkbox';
import { profilUser } from '@/services/userServices';
import { useRouter } from 'expo-router';


export default function ProfileScreen() {
  const { token } = useContext(AuthContext);
  const [userData, setUserData] = useState({
    pseudo: '',
    email: '',
    phone: '',
  });
  const [receiveEmails, setReceiveEmails] = useState(false);
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
          const { pseudo, mail, telephone, recevoirMail } = user;
  
          setUserData(prev => ({
            ...prev,
            pseudo: pseudo,
            email: mail,
            phone: telephone,
            receiveEmails: recevoirMail
          }));
          setReceiveEmails(user.recevoirMail);
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
  
  const handleToggleReceiveEmails = async () => {
    const newValue = !receiveEmails;
    setReceiveEmails(newValue); // mise à jour UI immédiate
  
    try {
      await updateReceiveMailPreference(token, newValue); // fonction à créer
    } catch (error) {
      console.error("Erreur lors de la mise à jour des préférences", error);
      setReceiveEmails(!newValue); // rollback en cas d'erreur
    }
  };
  

  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu />
      <Title text={'Mon Profil'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.formContainer}>
            {/* Remplacement des TextInput par InputField */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Pseudonyme</Text>
              <Text style={{ fontSize: 16 }}>{userData.pseudo}</Text>
            </View>

            {/* <InputField
              label="Mot de passe"
              value={userData.password}
              onChangeText={(text) => setUserData({ ...userData, password: text })}
              placeholder="••••••••"
              secureTextEntry
              
            /> */}

            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Adresse mail</Text>
              <Text style={{ fontSize: 16 }}>{userData.email}</Text>
            </View>


            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Téléphone</Text>
              <Text style={{ fontSize: 16 }}>{userData.phone}</Text>
            </View>


            {/* <InputField
              label="Nombre d'avis rédigés"
              value={userData.reviewsCount.toString()}
              onChangeText={(text) => setUserData({ ...userData, reviewsCount: parseInt(text) })}
              placeholder="Nombre d'avis"
              keyboardType="numeric"
              
            /> */}
            <CheckSwitch
              label="Recevoir des notifications par email"
              checked={receiveEmails}
              onToggle={handleToggleReceiveEmails}
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


function updateReceiveMailPreference(token: string | null, newValue: boolean) {
  throw new Error('Function not implemented.');
}

