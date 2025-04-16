import React from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { useLocalSearchParams } from 'expo-router';

export default function Index() {
  const { nomLieu } = useLocalSearchParams(); // ✅ récupère le nom passé depuis details_lieu.tsx

  // Données fictives pour l'exemple
  const nomUtilisateur = "Jean Dupont";
  const emailUtilisateur = "jean.dupont@example.com";

  return (
    <View style={{ flex: 1 }}>
      {/* Partie haute avec titre et nom du lieu */}
      <View style={styles.container}>
        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 24 }}>
          VOTRE AVIS
        </Text>
        <Text style={styles.lieuTitre}>{nomLieu || "Nom du lieu"}</Text>
      </View>

      {/* Encadré gris avec les infos de l'avis */}
      <View style={styles.formContainer}>
        {/* Infos utilisateur affichées */}
        <Text style={styles.staticText}>Nom : {nomUtilisateur}</Text>
        <Text style={styles.staticText}>Email : {emailUtilisateur}</Text>

        {/* Espace réservé pour les étoiles */}
        <View style={styles.starsContainer}>
          {Array.from({ length: 5 }).map((_, index) => (
            <Image
              key={index}
              source={require('../assets/images/Etoilegrises.png')}
              style={styles.starImage}
              />
              ))}
        </View>


        {/* Zone de texte pour l'avis */}
        <TextInput
          style={styles.textArea}
          placeholder="Écris ton avis ici..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={8}
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
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  starImage: {
    width: 24,
    height: 24,
    marginHorizontal: 4,
  },
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  card: {
    backgroundColor: '#f4f4f4',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  formContainer: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 10,
    padding: 15,
  },
  lieuTitre: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 50,
    color: '#28603E',
    textAlign: 'center',
    marginBottom: 15,
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
    minHeight: 120, // ✅ Agrandissement de la zone de texte
  },
  submitButton: {
    height: 40,
    width: '80%',
    backgroundColor: '#D37230',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 210,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
