import React, { useState } from "react";
import { Text, View, TextInput, TouchableOpacity, StyleSheet, Image, SafeAreaView } from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth, fontSubtitle } from './style/styles';
import { fontTitle, loadFonts } from './style/styles';
import MenuBurger from './components/menuburger';
import { Navigation } from "@/components/Navigation";
import { Title } from "@/components/Title";

export default function Index() {
  const { nomLieu } = useLocalSearchParams();

  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

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

    try {
      const response = await fetch('/api/avis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lieuId: nomLieu,
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
    <SafeAreaView style={styles.container}>
      <MenuBurger />
      <Title text={"Avis"}/>
     

      {/* Contenu principal */}
      <View style={styles.cardContainer}>
        <Text style={[fontTitle, styles.lieuTitre]}>{nomLieu || "Nom du lieu"}</Text>
        <Text style={styles.staticText}>Nom : {nomUtilisateur}</Text>
        <Text style={styles.staticText}>Email : {emailUtilisateur}</Text>

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

      {/* Bouton de validation */}
      <View style={{ alignItems: 'center', padding: 20 }}>
        <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
          <Text style={styles.submitButtonText}>Valider votre avis !</Text>
        </TouchableOpacity>
      </View>
      <Navigation></Navigation>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute', // Fixe le menu en haut
    top: 0, // Positionne le menu tout en haut
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff', // Assure un fond blanc
    borderBottomWidth: 0, // Supprime la ligne de démarcation
    zIndex: 10, // Assure que le menu est au-dessus des autres éléments
  },
  title: {
    textAlign: 'center',
    color: '#000', // Titre "Votre avis" en noir
  },
  cardContainer: {
    backgroundColor: '#f0f0f0',
    marginHorizontal: 20,
    marginTop: 60,
    borderRadius: 10,
    padding: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  lieuTitre: {
    marginBottom: 15,
    textAlign: 'center',
    color: colorButtonSecondary,
  },
  staticText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  starImage: {
    width: 24,
    height: 24,
    marginHorizontal: 4,
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
    backgroundColor: colorButtonFirst,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: colorButtonThird,
    fontWeight: 'bold',
    fontSize: 16,
  },
});