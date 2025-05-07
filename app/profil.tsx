import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  SafeAreaView,
  ScrollView,
  Alert,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';

// Composants existants
import { Navigation } from '@/components/NavBar/Navigation';
import { Title } from '@/components/Title';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import SubmitButton from './components/Form/SubmitButton';
import StarRating from '@/components/Notation/StarRating';

// Styles
import { colorButtonFirst, colorButtonSecondary } from './style/styles';
import { styles } from '@/app/style/profil.styles';

// Services
import { getProfil, updateProfil } from '@/services/profilServices';

const ProfileScreen = () => {
  const router = useRouter();
  const [userData, setUserData] = useState({
    pseudo: '',
    mail: '',
    telephone: '',
    nombre_avis: 0,
    note_moyenne: 0
  });
  const [editing, setEditing] = useState({
    pseudo: false,
    mail: false,
    telephone: false
  });
  const [tempValues, setTempValues] = useState({
    pseudo: '',
    mail: '',
    telephone: ''
  });
  const [loading, setLoading] = useState({
    profile: true,
    saving: false
  });

  // Chargement initial du profil
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfil();
        if (response.success && response.data) {
          setUserData(response.data);
          setTempValues({
            pseudo: response.data.pseudo,
            mail: response.data.mail,
            telephone: response.data.telephone || ''
          });
        }
      } catch (err) {
        Alert.alert('Erreur', 'Impossible de charger le profil');
      } finally {
        setLoading(prev => ({...prev, profile: false}));
      }
    };

    loadProfile();
  }, []);

  const handleEdit = (field: string) => {
    setEditing({...editing, [field]: true});
  };

  const handleCancelEdit = (field: string) => {
    setEditing({...editing, [field]: false});
    setTempValues({...tempValues, [field]: userData[field]});
  };

  const handleSave = async (field: string) => {
    try {
      setLoading(prev => ({...prev, saving: true}));
      
      const updatedData = {
        ...userData,
        [field]: tempValues[field]
      };

      const response = await updateProfil(updatedData);
      
      if (response.success) {
        setUserData(updatedData);
        setEditing({...editing, [field]: false});
        Alert.alert('Succès', 'Modification enregistrée');
      } else {
        throw new Error(response.message || 'Erreur lors de la mise à jour');
      }
    } catch (err) {
      Alert.alert('Erreur', err.message);
    } finally {
      setLoading(prev => ({...prev, saving: false}));
    }
  };

  const handleChange = (field: string, value: string) => {
    setTempValues({...tempValues, [field]: value});
  };

  if (loading.profile) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colorButtonFirst} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu />
      <Title text={'Mon Profil'} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          {/* Pseudo - Modifiable */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Pseudonyme</Text>
            {editing.pseudo ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={tempValues.pseudo}
                  onChangeText={(text) => handleChange('pseudo', text)}
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleCancelEdit('pseudo')}
                  >
                    <Text style={styles.buttonText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={() => handleSave('pseudo')}
                    disabled={loading.saving}
                  >
                    <Text style={styles.buttonText}>
                      {loading.saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.fieldValue}>{userData.pseudo}</Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEdit('pseudo')}
                >
                  <Text style={styles.editButtonText}>Modifier</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Email - Modifiable */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Adresse mail</Text>
            {editing.mail ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={tempValues.mail}
                  onChangeText={(text) => handleChange('mail', text)}
                  keyboardType="email-address"
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleCancelEdit('mail')}
                  >
                    <Text style={styles.buttonText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={() => handleSave('mail')}
                    disabled={loading.saving}
                  >
                    <Text style={styles.buttonText}>
                      {loading.saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.fieldValue}>{userData.mail}</Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEdit('mail')}
                >
                  <Text style={styles.editButtonText}>Modifier</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Téléphone - Modifiable */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Téléphone</Text>
            {editing.telephone ? (
              <View style={styles.editContainer}>
                <TextInput
                  style={styles.input}
                  value={tempValues.telephone}
                  onChangeText={(text) => handleChange('telephone', text)}
                  keyboardType="phone-pad"
                />
                <View style={styles.editButtons}>
                  <TouchableOpacity 
                    style={styles.cancelButton}
                    onPress={() => handleCancelEdit('telephone')}
                  >
                    <Text style={styles.buttonText}>Annuler</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.saveButton}
                    onPress={() => handleSave('telephone')}
                    disabled={loading.saving}
                  >
                    <Text style={styles.buttonText}>
                      {loading.saving ? 'Enregistrement...' : 'Enregistrer'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View style={styles.valueContainer}>
                <Text style={styles.fieldValue}>
                  {userData.telephone || 'Non renseigné'}
                </Text>
                <TouchableOpacity 
                  style={styles.editButton}
                  onPress={() => handleEdit('telephone')}
                >
                  <Text style={styles.editButtonText}>Modifier</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Nombre d'avis - Lecture seule */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Nombre d'avis rédigés</Text>
            <Text style={styles.fieldValue}>{userData.nombre_avis}</Text>
          </View>

          {/* Note moyenne - Lecture seule */}
          <View style={styles.fieldContainer}>
            <Text style={styles.fieldLabel}>Note moyenne</Text>
            <StarRating 
              rating={userData.note_moyenne} 
              editable={false}
              containerStyle={styles.ratingContainer}
            />
          </View>

          {/* Bouton changement de mot de passe */}
          <SubmitButton
            title="Changer de mot de passe"
            onPress={() => router.push('/change-password')}
            style={{backgroundColor: colorButtonSecondary, marginTop: 20}}
          />
        </View>
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
};

// Styles supplémentaires
const additionalStyles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  fieldContainer: {
    marginBottom: 20,
    width: '100%'
  },
  fieldLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333'
  },
  fieldValue: {
    fontSize: 16,
    color: '#555'
  },
  editContainer: {
    flexDirection: 'column'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
    marginBottom: 10
  },
  editButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end'
  },
  cancelButton: {
    padding: 10,
    marginRight: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 5
  },
  saveButton: {
    padding: 10,
    backgroundColor: colorButtonFirst,
    borderRadius: 5
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold'
  },
  valueContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  editButton: {
    padding: 5,
    backgroundColor: '#f5f5f5',
    borderRadius: 5
  },
  editButtonText: {
    color: colorButtonFirst,
    fontSize: 14
  },
  ratingContainer: {
    marginTop: 5
  }
});

export default ProfileScreen;