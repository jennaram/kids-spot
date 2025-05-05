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
  Modal,
  TouchableOpacity,
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

const MAX_CHARACTERS = 500;

const ReviewPage = () => {
  const params = useLocalSearchParams() as { id: string; nomLieu?: string };
  const lieuId = Number(params.id?.toString() || "1");

  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState("");
  const [lieuName, setLieuName] = useState(params.nomLieu || "Ce lieu");
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Debug state
  const [debugInfo, setDebugInfo] = useState({
    submissionAttempted: false,
    apiResponseReceived: false,
  });

  const { submitComment, loading, success, error } = useAddComment();
  const { token, loading: authLoading } = useContext(AuthContext);

  // Cette fonction sera utilisée pour montrer la modal directement
  const showConfirmationPopup = () => {
    console.log("Affichage de la popup de confirmation");
    setShowConfirmation(true);
  };

  useEffect(() => {
    console.log("État success:", success);
    console.log("État error:", error);
    
    if (success) {
      console.log("Succès détecté, affichage de la popup");
      setDebugInfo(prev => ({...prev, apiResponseReceived: true}));
      
      // Utiliser Alert natif en cas de problème avec la Modal
      if (Platform.OS === 'web') {
        // Sur web, on utilise toast (déjà configuré)
        toast.success("Votre avis a été enregistré avec succès !");
      } else {
        // Sur mobile, on utilise Alert en plus de la Modal
        Alert.alert(
          "Merci pour votre avis !",
          "Votre commentaire a été enregistré avec succès.",
          [{ text: "OK", onPress: () => console.log("Alert fermée") }]
        );
      }
      
      setShowConfirmation(true);
      resetForm();
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      console.log("Erreur détectée:", error);
      setDebugInfo(prev => ({...prev, apiResponseReceived: true}));
      
      if (Platform.OS === 'web') {
        toast.error(error);
      } else {
        Alert.alert("Erreur", error || "Une erreur est survenue lors de l'envoi de votre avis.");
      }
    }
  }, [error]);

  const handleSubmit = () => {
    console.log("Bouton de soumission cliqué");
    setDebugInfo(prev => ({...prev, submissionAttempted: true}));
    
    if (!validateForm()) {
      console.log("Validation du formulaire échouée");
      return;
    }
    
    console.log("Formulaire validé, envoi de l'avis...");
    submitReview();
  };

  const validateForm = () => {
    if (!token) {
      console.log("Erreur: utilisateur non connecté");
      if (Platform.OS === 'web') {
        toast.error("Vous devez être connecté pour poster un avis");
      } else {
        Alert.alert("Erreur", "Vous devez être connecté pour poster un avis");
      }
      return false;
    }
    if (!rating) {
      console.log("Erreur: aucune note sélectionnée");
      if (Platform.OS === 'web') {
        toast.error("Veuillez sélectionner une note.");
      } else {
        Alert.alert("Erreur", "Veuillez sélectionner une note.");
      }
      return false;
    }
    if (comment.trim().length < 10) {
      console.log("Erreur: commentaire trop court");
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
      console.log("Erreur: ID de lieu invalide");
      if (Platform.OS === 'web') {
        toast.error("Lieu invalide");
      } else {
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
    
    console.log("Envoi des données à l'API:", reviewData);
    try {
      await submitComment(reviewData, token);
      console.log("Requête submitComment lancée");
    } catch (e) {
      console.error("Erreur lors de l'envoi du commentaire:", e);
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

  const handleCloseConfirmation = () => {
    console.log("Fermeture de la popup demandée");
    setShowConfirmation(false);
    router.back();
  };

  // Afficher un bouton de test pour vérifier le modal
  const testModal = () => {
    console.log("Test de l'affichage de la modal");
    setShowConfirmation(true);
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
              style={styles.textAreaInput}
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
                disabled={!token}
              />
            </View>
            
            {/* Bouton de débogage pour tester la modal */}
            {__DEV__ && (
              <TouchableOpacity style={styles.debugButton} onPress={testModal}>
                <Text style={styles.debugButtonText}>Test Modal</Text>
              </TouchableOpacity>
            )}
            
            {/* Statut de débogage */}
            {__DEV__ && (
              <View style={styles.debugInfo}>
                <Text>Tentative d'envoi: {debugInfo.submissionAttempted ? "Oui" : "Non"}</Text>
                <Text>Réponse API reçue: {debugInfo.apiResponseReceived ? "Oui" : "Non"}</Text>
                <Text>État loading: {loading ? "Oui" : "Non"}</Text>
                <Text>État success: {success ? "Oui" : "Non"}</Text>
                <Text>État error: {error ? "Oui" : "Non"}</Text>
                <Text>Modal visible: {showConfirmation ? "Oui" : "Non"}</Text>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Pop-up de confirmation - version améliorée plus compatible */}
      <Modal
        visible={showConfirmation}
        transparent={true}
        animationType="fade"
        onRequestClose={handleCloseConfirmation}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Merci pour votre avis !</Text>
            <Text style={styles.modalMessage}>
              Votre commentaire a été enregistré avec succès.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={handleCloseConfirmation}
              activeOpacity={0.7}
            >
              <Text style={styles.modalButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Barre de navigation */}
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
  header: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: Platform.OS === "ios" ? 2 : 4,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButtonContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 10,
  },
  backButton: {
    top: 0,
    left: 15,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    top: 30,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  ratingContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2c3e50",
  },
  textAreaInput: {
    height: 150,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#888",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
  // Styles pour la pop-up de confirmation
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 24,
    width: "80%",
    maxWidth: 400,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 12,
    textAlign: "center",
    color: "#2c3e50",
  },
  modalMessage: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: "center",
    color: "#5d6d7e",
  },
  modalButton: {
    backgroundColor: "#3498db",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    width: "80%",
    alignItems: "center",
  },
  modalButtonText: {
    color: "#fff",
    fontWeight: "600",
    fontSize: 16,
  },
  // Styles pour le débogage
  debugButton: {
    backgroundColor: "#e74c3c",
    padding: 10,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  debugButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  debugInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
});

export default ReviewPage;