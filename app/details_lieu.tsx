
// Ajoutez d'abord l'import de votre composant BottomModal
import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import { Share } from 'react-native';
import { Alert, Platform, Linking } from 'react-native';
import { colorButtonFirst } from './style/styles';
import { IconesLieux } from '@/components/IconesLieux';
import { Navigation } from "@/components/NavBar/Navigation";
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Lieu } from "./types/lieu";
import { AvisButton } from "../components/Lieux/AvisButton";
import LieuActionButtons from "../components/Lieux/LieuActionButtons";
import ShareButton from "../components/Lieux/ShareButton";
import FavoriteButton from "@/components/Lieux/FavoriteButton";
import AgeBadges from "@/components/Lieux/AgeBadges";
import styles from "./style/DetailLieuxStyles";
import fetchPlace from "@/api/fetchPlace";
import { useAuth } from "@/context/auth";
import BottomModal from "../components/ModalRedirection"; // Importez votre composant BottomModal
import { useIsFavorite } from "@/hooks/useIsFavorite";

// Interface pour les données récupérées de l'APi
// Interface pour la réponse de l'API
interface ApiResponse {
  status: string;
  data: Lieu;
}

const DetailsLieu = () => {
  const params = useLocalSearchParams() as {id:string};
  const lieuId = params.id?.toString() || "2";
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lieu, setPlace] = useState<Lieu | null>(null);
  const {token, setToken} = useAuth();
  // État pour contrôler la visibilité de la modal de redirection
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("Connectez-vous pour continuer");
  
  const {isFavorite} = useIsFavorite();
  const EstFavori = isFavorite(Number(lieuId));

  async function handleFetchPlace() {
    setLoading(true);
    //setError(false);
    const result = await fetchPlace(Number(lieuId));
    if (result === null) {
     // setError(true);
    } else {
      setPlace(result.data);
    }
    setLoading(false);
  }

  useEffect(() => {handleFetchPlace()}
  , [lieuId]);

  console.log("token,", token);

  // Fonction de partage
  const handleShare = async () => {
    if (!lieu) return;
    
    try {
      const result = await Share.share({
        message: `Viens découvrir ${lieu.nom} sur KidsPot ! 🎉 https://kidspot.app/lieu/${lieu.id}`,
        title: "KidsPot - Sorties pour les enfants",
      });
  
      if (result.action === Share.sharedAction) {
        // Le contenu a été partagé 
      } else if (result.action === Share.dismissedAction) {
        // Le partage a été annulé
      }
    } catch (error: any) {
      console.error("Erreur lors du partage:", error);
    }
  };

  // Fonction modifiée pour gérer le clic sur favori en vérifiant la connexion
  function handleFavoriteToggle() {
    // Vérifier si l'utilisateur est connecté (token existe)
    if (!token) {
      // Si non connecté, afficher la modal de redirection
      setModalTitle("Connectez-vous pour ajouter aux favoris");
      setModalVisible(true);
    } 
  }
  function handleDonnerAvis() {
    if (!token) {
      setModalTitle("Connectez-vous pour donner votre avis");
      setModalVisible(true);
      return false;
    }
    return true;
  }

  // Fonction pour gérer la navigation GPS
  const handleGpsPress = () => {
    if (!lieu) return;
    
    const { latitude, longitude } = lieu.position;
  
    Alert.alert(
      "Choisissez une application",
      "Quelle application voulez-vous utiliser pour l'itinéraire ?",
      [
        {
          text: "Google Maps",
          onPress: () => {
            const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
            Linking.openURL(url);
          }
        },
        {
          text: "Waze",
          onPress: () => {
            const url = `https://waze.com/ul?ll=${latitude},${longitude}&navigate=yes`;
            Linking.openURL(url);
          }
        },
        {
          text: "Apple Plans",
          onPress: () => {
            const url = `http://maps.apple.com/?daddr=${latitude},${longitude}`;
            Linking.openURL(url);
          },
          style: Platform.OS === 'ios' ? "default" : "cancel",
        },
        {
          text: "Annuler",
          style: "cancel"
        }
      ]
    );
  };
  // Fonction pour appeler le lieu
  const handleCall = () => {
    if (!lieu || !lieu.adresse.telephone) return;
    
    const phoneNumber = lieu.adresse.telephone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  // Fonction pour visiter le site web
  const handleWebsite = () => {
    if (!lieu || !lieu.adresse.site_web) return;
    
    Linking.openURL(lieu.adresse.site_web);
  };

  // Affiche un indicateur de chargement pendant le chargement des données
  if (loading) {
    return (
        <View style={[styles.mainContainer, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colorButtonFirst} />
          <Text style={styles.loadingText}>Chargement des informations...</Text>
        </View>
    );
  }
  // Affiche un message d'erreur si le chargement a échoué
  if (error || !lieu) {
    return (
        <View style={[styles.mainContainer, styles.errorContainer]}>
          <MaterialIcons name="error-outline" size={48} color="red" />
          <Text style={styles.errorText}>{error || "Lieu non trouvé"}</Text>
          <TouchableOpacity 
            style={styles.retryButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.retryButtonText}>Retour</Text>
          </TouchableOpacity>
        </View>
    );
  }
  // Convertir les tranches d'âge en format d'affichage
  const tranchesAge = lieu.ages.map(age => age.nom);

  // Image par défaut si aucune n'est fournie
  const imageUrl = lieu.image_url || require("../assets/images/parc_montsouris.jpg");
  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu/>
      <View style={styles.mainContainer}>
        {/* Contenu scrollable */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Image principale avec bouton favori */}
          <View style={styles.imageContainer}>
            <Image
              source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
              style={styles.headerImage}
              resizeMode="cover"
            />
            {/* Bouton favori positionné directement dans le conteneur d'image */}
            <FavoriteButton
              onToggle={handleFavoriteToggle} idPlace={Number(lieuId)} initialState={EstFavori}/>
          </View>

          {/* Contenu principal */}
          <View style={styles.centeredContent}>
            <View style={styles.ratingShareContainer}>
              <View style={styles.ratingWrapper}>
                <View style={styles.ratingContainer}>
                  <Text style={styles.note}>{lieu.note_moyenne.toFixed(1)}</Text>
                  <MaterialIcons
                    name="star"
                    size={18}
                    color="black"
                    style={styles.starIcon}
                  />
                  <Text style={styles.avis}>{lieu.nombre_commentaires} avis membres</Text>
                </View>
              </View>
              <ShareButton onPress={handleShare} />
            </View>
            
            <Text style={styles.nom}>{lieu.nom}</Text>
            <Text style={styles.description}>{lieu.description}</Text>
            <View style={styles.horairesContainer}>
              <Text style={styles.horaires}>{lieu.horaires}</Text>
            </View>
            <AgeBadges tranchesAge={tranchesAge} />
            {/* Utilisation du composant IconesLieux avec les équipements du lieu */}
            <IconesLieux equipements={lieu.equipements} />
            <View style={styles.actionsContainer}>
              <View style={styles.rowButtons}>
                <AvisButton type="donner" nomLieu={lieu.nom} lieuId={lieu.id.toString()} onBeforeAction={handleDonnerAvis} />
                <AvisButton type="voir" nomLieu={lieu.nom} lieuId={lieu.id.toString()} />
              </View>
              <LieuActionButtons
                onCall={handleCall}
                onWebsite={handleWebsite}
                onGps={handleGpsPress}
                telephone={lieu.adresse.telephone}
                siteWeb={lieu.adresse.site_web}
              />
            </View>
          </View>
        </ScrollView>
      </View>
      
      {/* Modal de redirection qui s'affiche quand l'utilisateur n'est pas connecté */}
      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalTitle}
      />
      
      <Navigation/>
    </SafeAreaView>
  );
};

export default DetailsLieu;