import React, { useState, useEffect } from 'react';
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
import InputField from '@/app/components/Form/InputField';
import SubmitButton from '@/app/components/Form/SubmitButton';
import { styles } from '@/app/style/profil.styles';
import { getProfil, updateProfil } from '@/services/profilServices'; // Import des services
import { ProfilData } from '@/Types/profil'; // Assurez-vous d'avoir ce type

export default function ProfileScreen() {
  const [userData, setUserData] = useState<ProfilData>({
    pseudo: '',
    password: '••••••••', // Mot de passe masqué par défaut
    email: '',
    telephone: '',
    reviewsCount: 0,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Récupération du profil au chargement
  useEffect(() => {
    const fetchProfil = async () => {
      try {
        const response = await getProfil('123'); // Remplacez '123' par l'ID utilisateur dynamique
        if (response.success && response.data) {
          setUserData({
            ...response.data,
            email: response.data.mail, // Map 'mail' to 'email'
            password: '••••••••', // Garder le mot de passe masqué
          });
        } else {
          setError('Erreur lors du chargement du profil');
        }
      } catch (err) {
        setError('Erreur réseau');
      }
    };

    fetchProfil();
  }, []);

  const handlePasswordChange = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Redirection vers la page de changement de mot de passe');
    }, 2000);
  };

  const handleUpdateProfil = async () => {
    setLoading(true);
    try {
      const { password, reviewsCount, ...dataToUpdate } = userData; // Exclure les champs non modifiables
      const response = await updateProfil('123', dataToUpdate); // ID utilisateur dynamique
      if (response.success) {
        alert('Profil mis à jour !');
      } else {
        setError('Échec de la mise à jour');
      }
    } catch (err) {
      setError('Erreur API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu />
      <Title text={'Mon Profil'} />

      {error && <Text style={{ color: 'red', textAlign: 'center' }}>{error}</Text>}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.formContainer}>
            <InputField
              label="Pseudonyme"
              value={userData.pseudo}
              onChangeText={(text) => setUserData({ ...userData, pseudo: text })}
              placeholder="Entrez votre pseudonyme"
            />

            <InputField
              label="Mot de passe"
              value={userData.password || ''}
              onChangeText={() => {}} // Désactivé (rediriger vers un écran dédié)
              placeholder="••••••••"
              secureTextEntry
              editable={false}
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
              value={userData.telephone}
              onChangeText={(text) => setUserData({ ...userData, telephone: text })}
              placeholder="06 12 34 56 78"
              keyboardType="phone-pad"
            />

            <InputField
              label="Nombre d'avis rédigés"
              value={userData.reviewsCount?.toString() || '0'}
              onChangeText={() => {}} // Lecture seule
              keyboardType="numeric"
              editable={false}
            />

            <SubmitButton
              title="Enregistrer les modifications"
              onPress={handleUpdateProfil}
              loading={loading}
            />

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