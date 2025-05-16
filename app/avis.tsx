import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import BackButton from "@/app/components/BackButton";
import { Navigation } from "@/components/NavBar/Navigation";
import { Title } from "@/components/Title";
import { useAddComment } from "@/hooks/comments/useAddComment";
import { AddComment } from "@/Types/comment";
import { AuthContext } from "@/context/auth/AuthContext";
import StarRating from "@/components/Notation/StarRating";
import FormInput from "@/app/components/Form/InputField";
import SubmitButton from "@/app/components/Form/SubmitButton";
import { styles } from "@/app/style/avis.styles";

const MAX_CHARACTERS = 500;

const ReviewPage = () => {
  const params = useLocalSearchParams() as { lieuId: string; nomLieu?: string };

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [lieuName] = useState(params.nomLieu || "Ce lieu");
  const [lieuId] = useState(Number(params.lieuId) || 0);
  
  const { submitComment, loading, success, error } = useAddComment();
  const { token, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    //console.log("État success:", success);
    //console.log("État error:", error);
    
    if (success) {
      //console.log("Succès détecté, affichage de la notification");
      
      if (Platform.OS === 'web') {
        // Sur web, on utilise toast (déjà configuré)
        toast.success("Votre avis a été enregistré avec succès !");
      } else {
        // Sur mobile, on utilise Alert native
        Alert.alert(
          "Merci pour votre avis !",
          "Votre commentaire a été enregistré avec succès.",
          [{ text: "OK", onPress: () => router.back() }]
        );
      }
      
      resetForm();
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      //console.log("Erreur détectée:", error);
      
      if (Platform.OS === 'web') {
        toast.error(error);
      } else {
        Alert.alert("Erreur", error || "Une erreur est survenue lors de l'envoi de votre avis.");
      }
    }
  }, [error]);

  const handleSubmit = () => {
    //console.log("Bouton de soumission cliqué");
    
    if (!validateForm()) {
      //console.log("Validation du formulaire échouée");
      return;
    }
    
    //console.log("Formulaire validé, envoi de l'avis...");
    submitReview();
  };

  const validateForm = () => {
    if (!token) {
      //console.log("Erreur: utilisateur non connecté");
      if (Platform.OS === 'web') {
        toast.error("Vous devez être connecté pour poster un avis");
      } else {
        Alert.alert("Erreur", "Vous devez être connecté pour poster un avis");
      }
      return false;
    }
    if (!rating) {
      //console.log("Erreur: aucune note sélectionnée");
      if (Platform.OS === 'web') {
        toast.error("Veuillez sélectionner une note.");
      } else {
        Alert.alert("Erreur", "Veuillez sélectionner une note.");
      }
      return false;
    }
    if (comment.trim().length < 10) {
      //console.log("Erreur: commentaire trop court");
      if (Platform.OS === 'web') {
        toast.error("Votre commentaire doit contenir au moins 10 caractères.");
      } else {
        Alert.alert("Erreur", "Votre commentaire doit contenir au moins 10 caractères.");
      }
      return false;
    }
    return true;
  };

  const submitReview = async () => {
    if (lieuId <= 0) {
      //console.log("Erreur: ID de lieu invalide");
      if (Platform.OS === 'web') {
        toast.error("Lieu invalide");
      } else {
        //console.log(lieuId);
        Alert.alert("Erreur", "Lieu invalide");
      }
      return;
    }

    if (!token) return;

    const reviewData: AddComment = {
      id_lieu: lieuId,
      commentaire: comment.trim(),
      note: rating,
      token: token,
    };
    
    //console.log("Envoi des données à l'API:", reviewData);
    try {
      await submitComment(reviewData, token);
      //console.log("Requête submitComment lancée");
    } catch (e) {
      //console.error("Erreur lors de l'envoi du commentaire:", e);
      if (Platform.OS === 'web') {
        toast.error("Erreur lors de l'envoi du commentaire");
      } else {
        Alert.alert("Erreur", "Erreur lors de l'envoi du commentaire");
      }
    }
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
  };

  const getButtonText = () => {
    if (!token) return "Connectez-vous pour poster";
    return "Publier l'avis";
  };

  if (authLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header réorganisé avec BackButton en haut et Titre en dessous */}
      <View style={styles.header}>
        <View style={styles.backButtonContainer}>
          <BackButton style={styles.backButton} />
        </View>
        <View style={styles.titleContainer}>
          <Title text={`${lieuName}`} />
        </View>
      </View>

      {/* Contenu principal centré verticalement */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.content}>
            {/* Notation par étoiles */}
            <View style={styles.ratingContainer}>
              <StarRating
                rating={rating}
                setRating={setRating}
                disabled={loading || !token}
              />
            </View>

            {/* Champ de commentaire */}
            <Text style={styles.commentTitle}>Votre commentaire :</Text>
            <FormInput
              label=""
              value={comment}
              onChangeText={(text) => {
                if (text.length <= MAX_CHARACTERS) {
                  setComment(text);
                }
              }}
              placeholder={`Décrivez votre expérience à ${lieuName}...`}
              keyboardType="default"
              secureTextEntry={false}
              multiline={true}
            />
            <Text style={styles.charCount}>
              {comment.length} / {MAX_CHARACTERS}
            </Text>

            {/* Bouton de soumission */}
            <View style={styles.buttonContainer}>
              <SubmitButton
                title={getButtonText()}
                onPress={handleSubmit}
                loading={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Barre de navigation */}
      <Navigation />
    </SafeAreaView>
  );
};



export default ReviewPage;