import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  SafeAreaView,
  Share,
  Alert,
  Platform,
  Linking
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import { colorButtonFirst } from "./style/styles";
import { IconesLieux } from "@/components/IconesLieux";
import { Navigation } from "@/components/NavBar/Navigation";
import { AvisButton } from "../components/Lieux/AvisButton";
import LieuActionButtons from "../components/Lieux/LieuActionButtons";
import ShareButton from "../components/Lieux/ShareButton";
import FavoriteButton from "@/components/Lieux/FavoriteButton";
import AgeBadges from "@/components/Lieux/AgeBadges";
import styles from "./style/DetailLieuxStyles";
import { useAuth } from "@/context/auth";
import BottomModal from "../components/ModalRedirection";
import { useIsFavorite } from "@/hooks/favorite/useIsFavorite";
import BackButton from "./components/BackButton";
import { useReadLocations } from "@/hooks/locate/useReadLocations";

const DetailsLieu = () => {
  const params = useLocalSearchParams() as { id: string };
  const lieuId = Number(params.id?.toString() || "2");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const { location: lieu, loading, error } = useReadLocations(lieuId);

  const { token } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("Connectez-vous pour continuer");

  const { isFavorite } = useIsFavorite();
  const EstFavori = isFavorite(lieuId);

  const handleShare = async () => {
    if (!lieu) return;
    try {
      const result = await Share.share({
        message: `Viens découvrir ${lieu.nom} sur KidsPot ! 🎉 https://kidspot.app/lieu/${lieu.id}`,
        title: "KidsPot - Sorties pour les enfants",
      });
    } catch (error: any) {
      console.error("Erreur lors du partage:", error);
    }
  };

  function handleFavoriteToggle() {
    if (!token) {
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
          style: Platform.OS === "ios" ? "default" : "cancel",
        },
        {
          text: "Annuler",
          style: "cancel"
        }
      ]
    );
  };

  const handleCall = () => {
    if (!lieu || !lieu.adresse.telephone) return;
    const phoneNumber = lieu.adresse.telephone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWebsite = () => {
    if (!lieu || !lieu.adresse.site_web) return;
    Linking.openURL(lieu.adresse.site_web);
  };

  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colorButtonFirst} />
        <Text style={styles.loadingText}>Chargement des informations...</Text>
      </View>
    );
  }

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

  const tranchesAge = lieu.ages.map(age => age.nom);
  const imageUrl = lieu.image_url || require("../assets/images/parc_montsouris.jpg");

  return (
    <SafeAreaView style={styles.safeArea}>
      <BackButton style={styles.backButton} />
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <FavoriteButton
              onToggle={handleFavoriteToggle}
              idPlace={lieuId}
              initialState={EstFavori}
            />
          </View>

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
            <IconesLieux equipements={lieu.equipements} />

            <View style={styles.actionsContainer}>
              <View style={styles.rowButtons}>
                <AvisButton
                  type="donner"
                  nomLieu={lieu.nom}
                  lieuId={lieu.id.toString()}
                  onBeforeAction={handleDonnerAvis}
                />
                <AvisButton
                  type="voir"
                  nomLieu={lieu.nom}
                  lieuId={lieu.id.toString()}
                />
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

      <BottomModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title={modalTitle}
      />

      <Navigation />
    </SafeAreaView>
  );
};

export default DetailsLieu;