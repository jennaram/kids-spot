import React, { useState, useEffect, useContext } from "react";
import {
  Text,
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BurgerMenu } from "@/components/BurgerMenu/BurgerMenu";
import { Navigation } from "@/components/NavBar/Navigation";
import { Title } from "@/components/Title";
import { useAddComment } from "@/hooks/comments/useAddComment";
import { AddComment } from "@/Types/comment";
import { AuthContext } from "@/context/auth/AuthContext";
import StarRating from "@/components/Notation/StarRating";
import FormInput from "@/app/components/Form/InputField"; // Mettez à jour le chemin selon votre projet

const MAX_CHARACTERS = 500;

const ReviewPage = () => {
  const params = useLocalSearchParams() as { id: string };
  const lieuId = Number(params.id?.toString() || "0");

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [lieuName, setLieuName] = useState("Ce lieu");

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

  const handleSubmit = async () => {
    if (!validateForm()) return;
    await submitReview();
  };

  const validateForm = () => {
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
    return true;
  };

  const submitReview = async () => {
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

    await submitComment(reviewData, token);
  };

  const resetForm = () => {
    setRating(0);
    setComment("");
  };

  const SubmitButton = () => (
    <TouchableOpacity
      style={[
        styles.submitButton,
        loading && styles.disabledButton,
        (!token || !rating || comment.length < 10) && styles.inactiveButton,
      ]}
      onPress={handleSubmit}
      activeOpacity={0.8}
      disabled={loading || !token || !rating || comment.length < 10}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : !token ? (
        <Text style={styles.submitButtonText}>Connectez-vous pour poster</Text>
      ) : (
        <Text style={styles.submitButtonText}>Publier votre avis</Text>
      )}
    </TouchableOpacity>
  );

  if (authLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <BurgerMenu />
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Title text={`Avis sur ${lieuName}`} />

          <View style={styles.cardContainer}>
            
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
<Text style={styles.charCount}>{comment.length} / {MAX_CHARACTERS}</Text>

          </View>

          <View style={styles.buttonContainer}>
            <SubmitButton />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

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
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  cardContainer: {
    backgroundColor: "#f8f8f8",
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
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
  },
  submitButton: {
    height: 50,
    width: "90%",
    backgroundColor: "#3498db",
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: "#95a5a6",
  },
  inactiveButton: {
    backgroundColor: "#bdc3c7",
  },
  submitButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },

  textAreaInput: {
    height: 150,
    textAlignVertical: 'top',
  },
  
});

export default ReviewPage;
