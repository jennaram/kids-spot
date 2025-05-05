import React, { useState, useEffect, useContext } from "react";
import { 
  Text, 
  View, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  Image, 
  SafeAreaView,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView
} from "react-native";
import { router, useLocalSearchParams } from 'expo-router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Navigation } from "@/components/NavBar/Navigation";
import { Title } from "@/components/Title";
import { useAddComment } from "@/hooks/comments/useAddComment";
import { AddComment } from "@/Types/comment";
import { AuthContext } from "@/context/auth/AuthContext";

const STAR_IMAGES = {
  active: require('../assets/images/Etoilejaune.png'),
  inactive: require('../assets/images/Etoilegrise.png')
};

const ReviewPage = () => {
  const params = useLocalSearchParams() as { id: string };
  const lieuId = Number(params.id?.toString() || "0");
  
  const [rating, setRating] = useState<number | null>(null);
  const [comment, setComment] = useState('');
  const [lieuName, setLieuName] = useState<string>("Ce lieu");
  
  const { submitComment, loading, success, error } = useAddComment();
  const { token, loading: authLoading } = useContext(AuthContext);

  useEffect(() => {
    if (success) {
      toast.success('Votre avis a été enregistré avec succès !');
      resetForm();
      setTimeout(() => router.back(), 2000);
    }
  }, [success]);

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleStarPress = (starNumber: number) => {
    if (!loading) {
      setRating(starNumber);
    }
  };

  const handleCommentChange = (text: string) => {
    setComment(text);
  };

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
      toast.error('Veuillez sélectionner une note.');
      return false;
    }
    if (comment.trim().length < 10) {
      toast.error('Votre commentaire doit contenir au moins 10 caractères.');
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
      note: rating || 0,
      token: token,
    };

    await submitComment(reviewData, token);
  };

  const resetForm = () => {
    setRating(null);
    setComment('');
  };

  const StarRating = () => (
    <View style={styles.starsContainer}>
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity 
          key={star} 
          onPress={() => handleStarPress(star)}
          activeOpacity={0.7}
          disabled={loading || !token}
        >
          <Image
            source={star <= (rating || 0) ? STAR_IMAGES.active : STAR_IMAGES.inactive}
            style={styles.starImage}
          />
        </TouchableOpacity>
      ))}
    </View>
  );

  const CommentInput = () => (
    <TextInput
      style={styles.textArea}
      placeholder={`Décrivez votre expérience à ${lieuName}...`}
      placeholderTextColor="#999"
      multiline
      numberOfLines={8}
      value={comment}
      onChangeText={handleCommentChange}
      editable={!loading && !!token}
    />
  );

  const SubmitButton = () => (
    <TouchableOpacity 
      style={[
        styles.submitButton, 
        loading && styles.disabledButton,
        (!token || !rating || comment.length < 10) && styles.inactiveButton
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <Title text={`Avis sur ${lieuName}`} />
          
          <View style={styles.cardContainer}>
            <Text style={styles.ratingTitle}>Notez ce lieu :</Text>
            <StarRating />
            
            <Text style={styles.commentTitle}>Votre commentaire :</Text>
            <CommentInput />
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
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    paddingBottom: 80,
  },
  cardContainer: {
    backgroundColor: '#f8f8f8',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  ratingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#2c3e50',
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
    color: '#2c3e50',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 10,
  },
  starImage: {
    width: 32,
    height: 32,
    marginHorizontal: 6,
  },
  textArea: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 150,
    borderWidth: 1,
    borderColor: '#ddd',
    color: '#333',
  },
  buttonContainer: {
    alignItems: 'center',
    padding: 20,
    marginTop: 10,
  },
  submitButton: {
    height: 50,
    width: '90%',
    backgroundColor: '#3498db',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  inactiveButton: {
    backgroundColor: '#bdc3c7',
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default ReviewPage;