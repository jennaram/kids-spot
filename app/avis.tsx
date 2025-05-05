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


const MAX_CHARACTERS = 500;

const ReviewPage = () => {
  const params = useLocalSearchParams() as { id: string };
  const lieuId = Number(params.id?.toString() || "1");

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [lieuName, setLieuName] = useState(params.nomLieu || "Ce lieu");

  const { submitComment, loading, success, error } = useAddComment();
  const { token, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (success) {
      toast.success("Votre avis a été enregistré avec succès !");
      resetForm();
      setTimeout(() => router.back(), 2000);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSubmit =() => {
    console.log("je click");
    if (!validateForm()) return;
    submitReview();
  };

  const validateForm = () => {
    console.log("je vérifie");
    console.log(comment);
    if (!token) {
      toast.error("Vous devez être connecté pour poster un avis");
      return false;
    }
    if (!rating) {
      toast.error("Veuillez sélectionner une note.");
      return false;
    }
    if (comment.trim().length < 10) {
      toast.error("Votre commentaire doit contenir au moins 10 caractères.");
      return false;
    }
    console.log("tout va bien");
    return true;
  };

  const submitReview = async () => {
    console.log(lieuId)
    if (lieuId <= 0) {
      toast.error("Lieu invalide");
      return;
    }

    if (!token) return;

    const reviewData: AddComment = {
      id_lieu: lieuId,
      commentaire: comment.trim(),
      note: rating,
      token: token,
    };
    console.log("je suis ici");
    await submitComment(reviewData, token);
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
  };

  // Déterminez le texte du bouton en fonction de l'état
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
      <BackButton style={styles.backButton} />
      <View style={styles.container}>
      <Title text={`${lieuName}`} />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView 
          contentContainerStyle={styles.scrollContainer}
          showsVerticalScrollIndicator={false}
        >
          <View style={[styles.contentWrapper, { paddingHorizontal: 20 }]}>
            <StarRating
              rating={rating}
              setRating={setRating}
              disabled={loading || !token}
            />
  
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
          </View>
  
          <View style={styles.buttonContainer}>
            <View style={styles.buttonWrapper}>
              <SubmitButton
                title={getButtonText()}
                onPress={handleSubmit}
                loading={loading}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
  
      </View>
      
      <Navigation />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  input: {
    flex: 1, // Permet au champ de texte de prendre tout l'espace disponible
  },
  
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
    justifyContent: "center", // Centre verticalement le contenu
    minHeight: "100%", // Assure que le conteneur prend toute la hauteur disponible
  },
  contentWrapper: {
    width: "100%",
    paddingVertical: 20,
  },

  ratingTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2c3e50",
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
    color: "#2c3e50",
  },
  charCount: {
    alignSelf: "flex-end",
    marginTop: 5,
    fontSize: 12,
    color: "#888",
  },
  buttonContainer: {
    alignItems: "center",
    padding: 20,
    marginTop: 10,
    width: "100%",
  },
  buttonWrapper: {
    width: "80%",
    backgroundColor: "#fff", // Utilisez la même couleur que votre SubmitButton
    borderRadius: 8, // Utilisez le même rayon que votre SubmitButton
    paddingHorizontal: 20, // Ajoute de l'espace horizontal supplémentaire
    paddingVertical: 3, // Ajoute un peu d'espace vertical si nécessaire
  },
  textAreaInput: {
    height: 150,
    textAlignVertical: "top",
  },
  backButton: {
    
    top: 0,
    left: 15,
    zIndex: 1,
  },
  
});

export default ReviewPage;