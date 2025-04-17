import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { ToastContainer, toast } from 'react-toastify'; // Assurez-vous d'avoir installé react-toastify pour la gestion des notifications (si nécessaire)
import 'react-toastify/dist/ReactToastify.css';

export default function Index() {
  const { nomLieu } = useLocalSearchParams(); // Récupère le nom du lieu passé depuis details_lieu.tsx

  const [rating, setRating] = useState<number | null>(null); // État pour la note
  const [comment, setComment] = useState(''); // État pour le commentaire

  // Données fictives pour l'exemple
  const nomUtilisateur = "Jean Dupont";
  const emailUtilisateur = "jean.dupont@example.com";

  const handleStarClick = (starNumber: number) => {
    setRating(starNumber);
  };

  const handleCommentChange = (event: React.ChangeEvent<any>) => {
    setComment(event.target.value);
  };

  const handleSubmit = async () => {
    if (!rating) {
      toast.error('Veuillez sélectionner une note.');
      return;
    }

    // Ici, vous ajouteriez votre appel API pour enregistrer l'avis
    try {
      // Exemple d'appel API (à adapter selon votre backend)
      const response = await fetch('/api/avis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lieuId: nomLieu, // Récupère l'ID du lieu
          rating,
          comment,
        }),
      });

      if (response.ok) {
        toast.success('Votre avis a été enregistré avec succès !');
      } else {
        toast.error('Une erreur est survenue lors de l\'enregistrement de votre avis.');
      }
    } catch (error) {
      toast.error('Une erreur s\'est produite lors de la communication avec le serveur.');
    }
  };

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

        {/* Sélection des étoiles */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => handleStarClick(star)}>
              <Image
                source={star <= (rating || 0) ? require('../assets/images/Etoilejaune.png') : require('../assets/images/Etoilegrise.png')}
                style={styles.starImage}
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Zone de texte pour l'avis */}
        <TextInput
          style={styles.textArea}
          placeholder="Écris ton avis ici..."
          placeholderTextColor="#999"
          multiline
          numberOfLines={8}
          value={comment}
          onChange={handleCommentChange}
        />
      </View>

      {/* Bouton Valider */}
      <View style={{ alignItems: 'center', padding: 20 }}>
        <TouchableOpacity style={styles.submitButton} onPress={() => router.push('/details_lieu')}>
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
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    fontSize: 16,
    textAlignVertical: 'top',
    marginTop: 10,
    minHeight: 120,
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
