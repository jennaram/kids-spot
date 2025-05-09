import React, { useState } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { colorButtonFirst, colorButtonSecondary } from './style/styles';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Navigation } from "@/components/NavBar/Navigation";
import { Title } from '@/components/Title';
import InputField from '@/app/components/Form/InputField';
import SubmitButton from '@/app/components/Form/SubmitButton';
import { styles } from '@/app/style/profil.styles';

const additionalStyles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modifyButton: {
    backgroundColor: colorButtonFirst,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    width: '48%',
  },
  cancelButtonText: {
    color: '#333',
  },
  saveButton: {
    width: '48%',
    backgroundColor: colorButtonFirst,
  },
});

export default function ProfileScreen() {
  const router = useRouter();
  const [userData, setUserData] = useState({
    pseudo: 'Utilisateur123',
    email: 'email@exemple.com',
    phone: '06 12 34 56 78',
  });
  const [editing, setEditing] = useState({
    pseudo: false,
    email: false,
    phone: false,
  });
  const [tempValues, setTempValues] = useState({
    pseudo: '',
    email: '',
    phone: '',
  });

  const handleEdit = (field: string) => {
    setTempValues({
      ...tempValues,
      [field]: userData[field as keyof typeof userData]
    });
    setEditing({
      ...editing,
      [field]: true
    });
  };

  const handleSave = (field: string) => {
    setUserData({
      ...userData,
      [field]: tempValues[field as keyof typeof tempValues]
    });
    setEditing({
      ...editing,
      [field]: false
    });
  };

  const handleCancel = (field: string) => {
    setEditing({
      ...editing,
      [field]: false
    });
  };

  const handlePasswordChange = () => {
    router.push('/forgotpassword');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu />
      <Title text={'Mon Profil'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <View style={styles.formContainer}>
            {/* Pseudonyme */}
            <View style={styles.fieldContainer}>
              <InputField
                label="Pseudonyme"
                value={editing.pseudo ? tempValues.pseudo : userData.pseudo}
                onChangeText={(text) => setTempValues({...tempValues, pseudo: text})}
                placeholder="Entrez votre pseudonyme"
                editable={editing.pseudo}
              />
              {editing.pseudo ? (
                <View style={styles.editActions}>
                  <SubmitButton
                    title="Annuler"
                    onPress={() => handleCancel('pseudo')}
                    style={styles.cancelButton}
                    textStyle={styles.cancelButtonText}
                  />
                  <SubmitButton
                    title="Enregistrer"
                    onPress={() => handleSave('pseudo')}
                    style={styles.saveButton}
                  />
                </View>
              ) : (
                <SubmitButton
                  title="Modifier"
                  onPress={() => handleEdit('pseudo')}
                  style={styles.modifyButton}
                />
              )}
            </View>

            {/* Adresse mail */}
            <View style={styles.fieldContainer}>
              <InputField
                label="Adresse mail"
                value={editing.email ? tempValues.email : userData.email}
                onChangeText={(text) => setTempValues({...tempValues, email: text})}
                placeholder="email@exemple.com"
                keyboardType="email-address"
                editable={editing.email}
              />
              {editing.email ? (
                <View style={styles.editActions}>
                  <SubmitButton
                    title="Annuler"
                    onPress={() => handleCancel('email')}
                    style={styles.cancelButton}
                    textStyle={styles.cancelButtonText}
                  />
                  <SubmitButton
                    title="Enregistrer"
                    onPress={() => handleSave('email')}
                    style={styles.saveButton}
                  />
                </View>
              ) : (
                <SubmitButton
                  title="Modifier"
                  onPress={() => handleEdit('email')}
                  style={styles.modifyButton}
                />
              )}
            </View>

            {/* Téléphone */}
            <View style={styles.fieldContainer}>
              <InputField
                label="Téléphone"
                value={editing.phone ? tempValues.phone : userData.phone}
                onChangeText={(text) => setTempValues({...tempValues, phone: text})}
                placeholder="06 12 34 56 78"
                keyboardType="phone-pad"
                editable={editing.phone}
              />
              {editing.phone ? (
                <View style={styles.editActions}>
                  <SubmitButton
                    title="Annuler"
                    onPress={() => handleCancel('phone')}
                    style={styles.cancelButton}
                    textStyle={styles.cancelButtonText}
                  />
                  <SubmitButton
                    title="Enregistrer"
                    onPress={() => handleSave('phone')}
                    style={styles.saveButton}
                  />
                </View>
              ) : (
                <SubmitButton
                  title="Modifier"
                  onPress={() => handleEdit('phone')}
                  style={styles.modifyButton}
                />
              )}
            </View>

            {/* Bouton "Changer de mot de passe" */}
            <SubmitButton
              title="Changer de mot de passe"
              onPress={handlePasswordChange}
              style={{ marginTop: 20, backgroundColor: colorButtonSecondary }}
            />
          </View>
        </View>
      </ScrollView>
      <Navigation />
    </SafeAreaView>
  );
}

// Ajout des styles supplémentaires
const additionalStyles = StyleSheet.create({
  fieldContainer: {
    marginBottom: 20,
  },
  editActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  modifyButton: {
    backgroundColor: colorButtonFirst,
    marginTop: 10,
  },
  cancelButton: {
    backgroundColor: '#f5f5f5',
    width: '48%',
  },
  cancelButtonText: {
    color: '#333',
  },
  saveButton: {
    width: '48%',
    backgroundColor: colorButtonFirst,
  },
});