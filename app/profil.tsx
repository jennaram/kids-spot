import React, { useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Navigation } from "@/components/NavBar/Navigation";
import { Title } from '@/components/Title';
import InputField from '@/app/components/Form/InputField';
import SubmitButton from '@/app/components/Form/SubmitButton';
import { styles } from '@/app/style/profil.styles';
import { AuthContext } from "@/context/auth/AuthContext";
import CheckSwitch from '@/components/Checkbox';
import { useProfilUser } from '@/hooks/user/useProfilUser';
import { useReceiveMail } from '@/hooks/user/useReceiveMail';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  // Récupération du token utilisateur via le contexte
  const { token } = useContext(AuthContext);

  // Récupération des infos utilisateur avec un hook personnalisé
  const { profil } = useProfilUser(token ?? '');

  // Hook personnalisé pour gérer la mise à jour des préférences de mail
  const {
    submit,
    loading: receiveMailLoading,
    error: receiveMailError,
    success: receiveMailSuccess,
  } = useReceiveMail();

  // Stocke les infos de base de l'utilisateur
  const [userData, setUserData] = useState({
    pseudo: '',
    email: '',
    phone: '',
  });

  // État local pour le switch "Recevoir des mails"
  const [receiveEmails, setReceiveEmails] = useState(false);

  // État pour afficher le chargement du bouton "changer de mot de passe"
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  // Met à jour le formulaire dès que les infos du profil sont chargées
  useEffect(() => {
    if (profil) {
      setUserData(prevData => ({
        ...prevData,
        pseudo: profil.pseudo,
        email: profil.mail,
        phone: profil.telephone,
      }));
      setReceiveEmails(profil.recevoirMail);
    }
  }, [profil]);

  // Affiche une alerte en cas de succès de mise à jour de préférence
  useEffect(() => {
    if (receiveMailSuccess) {
      Alert.alert(
        "Préférences mises à jour",
        `Vous ${receiveEmails ? "recevrez" : "ne recevrez plus"} les notifications par email.`
      );
    }
  }, [receiveMailSuccess]);

  // Affiche une alerte en cas d’erreur
  useEffect(() => {
    if (receiveMailError) {
      Alert.alert(
        "Erreur",
        "Une erreur est survenue lors de la mise à jour de vos préférences email."
      );
    }
  }, [receiveMailError]);

  // Redirige vers la page de réinitialisation de mot de passe
  const handlePasswordChange = () => {
    router.push('users/forgotpassword');
  };

  // Gère le switch on/off pour la réception d'emails
  const handleToggleReceiveEmails = async () => {
    const newValue = !receiveEmails;
    setReceiveEmails(newValue); // Mise à jour immédiate dans l’UI

    try {
      if (token) {
        await submit(token, newValue); // Appel API
      }
    } catch (error) {
      // Annule la modification dans l’UI si erreur
      setReceiveEmails(!newValue);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu />
      <Title text={'Mon Profil'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.formContainer}>
            {/* Pseudo (lecture seule) */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Pseudonyme</Text>
              <Text style={{ fontSize: 16 }}>{userData.pseudo}</Text>
            </View>

            {/* Email (lecture seule) */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Adresse mail</Text>
              <Text style={{ fontSize: 16 }}>{userData.email}</Text>
            </View>

            {/* Téléphone (lecture seule) */}
            <View style={{ marginBottom: 16 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 16, marginBottom: 4 }}>Téléphone</Text>
              <Text style={{ fontSize: 16 }}>{userData.phone}</Text>
            </View>

            {/* Switch pour la réception des emails */}
            <CheckSwitch
              label="Recevoir des notifications par email"
              checked={receiveEmails}
              onToggle={handleToggleReceiveEmails}
            />

            {/* Bouton de changement de mot de passe */}
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
