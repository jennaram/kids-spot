import React, { useState } from "react";
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  SafeAreaView 
} from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  colorButtonFirst, 
  colorButtonSecondary, 
  colorButtonThird, 
  fontTitle,
  fontSubtitle
} from './style/styles';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Navigation } from "@/components/NavBar/Navigation";
import { Title } from "@/components/Title";

// Constantes pour les valeurs réutilisables
const USER = {
  name: "Jean Dupont",
  email: "jean.dupont@example.com"
};

const STAR_IMAGES = {
  active: require('../assets/images/Etoilejaune.png'),
  inactive: require('../assets/images/Etoilegrise.png')
};

const ReviewPage = () => {
  // Hooks
  const { nomLieu } = useLocalSearchParams();
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');

  // Handlers
  const handleStarPress = (starNumber: number) => {
    setRating(starNumber);
  };

  const handleCommentChange = (text: string) => {
    setComment(text);
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await submitReview();
  };

  // Fonctions de logique métier
  const validateForm = () => {
    if (!rating) {
      toast.error('Veuillez sélectionner une note.');
      return false;
    }
    return true;
  };

  const submitReview = async () => {
    try {
      const response = await fetch('/api/avis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lieuId: nomLieu,
          rating,
          comment,
        }),
      });

      if (response.ok) {
        toast.success('Votre avis a été enregistré avec succès !');
        resetForm();
      } else {
        throw new Error('Erreur serveur');
      }
    } catch (error) {
      toast.error("Une erreur s'est produite");
    }
  };

  const resetForm = () => {
    setRating(null);
    setComment('');
  };

  // Composants internes
  const StarRating = () => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity 
          key={star} 
          onPress={() => handleStarPress(star)}
          activeOpacity={0.7}
        >
          <Image
            source={star <= (rating || 0) ? STAR_IMAGES.active : STAR_IMAGES.inactive}
            style={styles.starImage}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const UserInfoSection = () => (
    <View style={styles.userInfoContainer}>
      <Text style={styles.staticText}>Nom : {USER.name}</Text>
      <Text style={styles.staticText}>Email : {USER.email}</Text>
    </View>
  );

  const CommentInput = () => (
    <TextInput
      style={styles.textArea}
      placeholder="Écris ton avis ici..."
      placeholderTextColor="#999"
      multiline
      numberOfLines={8}
      value={comment}
      onChangeText={handleCommentChange}
    />
  );

  const SubmitButton = () => (
    <TouchableOpacity 
      style={styles.submitButton} 
      onPress={handleSubmit}
      activeOpacity={0.8}
    >
      <Text style={styles.submitButtonText}>Valider votre avis !</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <BurgerMenu/>
      <Title text={"Avis"}/>
      
      <View style={styles.cardContainer}>
        <Text style={[fontTitle, styles.lieuTitre]}>
          {nomLieu || "Nom du lieu"}
        </Text>
        
        <UserInfoSection />
        <StarRating />
        <CommentInput />
      </View>

      <View style={styles.buttonContainer}>
        <SubmitButton />
      </View>

      <Navigation />
      <ToastContainer />
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  userInfoContainer: {
    marginBottom: 15,
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
  buttonContainer: {
    alignItems: 'center', 
    padding: 20
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

export default ReviewPage;