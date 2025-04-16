import { Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

export default function Index() {
  const router = useRouter();

  // Données fictives pour l'exemple
  const lieu = "Parc Floral de Paris";
  const nomUtilisateur = "Jean Dupont";
  const emailUtilisateur = "jean.dupont@example.com";

  return (
    <View style={{ flex: 1 }}>
      {/* Partie haute avec logo et texte */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 80 }}>
        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 24 }}>
          VOTRE AVIS
        </Text>
      </View>

      {/* Encadré gris avec les infos de l'avis */}
      <View style={styles.formContainer}>
        {/* Titre du lieu */}
        <Text style={styles.lieuTitre}>{lieu}</Text>

        {/* Infos utilisateur affichées */}
        <Text style={styles.staticText}>Nom : {nomUtilisateur}</Text>
        <Text style={styles.staticText}>Email : {emailUtilisateur}</Text>

        {/* Espace réservé pour les étoiles */}
        <View style={styles.starsPlaceholder}>
          <Text style={{ color: '#999' }}>(Ici les 5 étoiles)</Text>
        </View>

        {/* Zone de texte pour l'avis */}
        <TextInput
          style={styles.textArea}
          placeholder="Écris ton avis ici..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={5}
        />
      </View>

      {/* Bouton Valider */}
      <View style={{ alignItems: 'center', padding: 20 }}>
        <TouchableOpacity style={styles.submitButton} onPress={() => {}}>
          <Text style={styles.submitButtonText}>Valider votre avis !</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  formContainer: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    borderRadius: 10,
    padding: 15,
  },
  lieuTitre: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#28603E',
    textAlign: 'center',
  },
  staticText: {
    fontSize: 16,
    marginBottom: 5,
    color: '#555',
  },
  starsPlaceholder: {
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
    borderRadius: 8,
    borderColor: '#ccc',
    borderWidth: 1,
    backgroundColor: '#fff',
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    marginTop: 10,
  },
  submitButton: {
    height: 40,
    width: '50%',
    backgroundColor: '#D37230',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
