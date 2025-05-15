import React, { useEffect, useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
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
  Linking,
  StyleSheet
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
import { useAuth, } from "@/context/auth";
import BottomModal from "../components/ModalRedirection";
import { useIsFavorite } from "@/hooks/favorite/useIsFavorite";
import BackButton from "./components/BackButton";
import { useReadPlace } from "@/hooks/place/useReadPlace";
import { IMAGE_BASE_URL } from '@/api/apiConfig';
import { Row } from "@/components/Row";
import { Button } from "@/components/Button";
import { useDeletePlaceOrEvent } from "@/hooks/place/useDeletePlace";
import { useLocation } from '@/context/locate/LocationContext';

const DetailsLieu = () => {
  const { removePlaceOrEvent, error: errorDel, success: successDel } = useDeletePlaceOrEvent();
  const params = useLocalSearchParams() as { id: string };
  const lieuId = Number(params.id?.toString() || "2");
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { refreshLocation } = useLocation();

  const { place, loading, error } = useReadPlace(lieuId);

  const { token, grade } = useAuth();
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState("Connectez-vous pour continuer");

  const { isFavorite } = useIsFavorite();
  const EstFavori = isFavorite(lieuId);

  const [imageError, setImageError] = useState(false);

  const handleShare = async () => {
    if (!place) return;
    try {
      const result = await Share.share({
        message: `Viens découvrir ${place.nom} sur KidsPot ! 🎉 https://kidspot.app/lieu/${place.id}`,
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
    if (!place) return;

    const { latitude, longitude } = place.position;

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
  }

  const handleDelete = () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer ce lieu ?',
      [
        {
          text: 'Non',
        },
        {
          text: 'Oui',
          onPress: async () => {
            if (token) {
              await removePlaceOrEvent(lieuId, token);
            }
          },
        },
      ],
      { cancelable: false }
    );
  }

  useEffect(() => {
    if (successDel) {
      refreshLocation();
      Alert.alert(
        'Succès',
        'Le lieu a été supprimé avec succès',
        [{ text: 'OK' }]
      );
      router.back();
    }
    if (errorDel) {
      Alert.alert('Erreur', 'Erreur lors de la suppression du lieu');
    }
  }, [successDel, errorDel]);

  const handleCall = () => {
    if (!place || !place.adresse.telephone) return;
    const phoneNumber = place.adresse.telephone.replace(/\s/g, '');
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const handleWebsite = () => {
    if (!place || !place.adresse.site_web) return;
    Linking.openURL(place.adresse.site_web);
  };

  if (loading) {
    return (
      <View style={[styles.mainContainer, styles.loadingContainer]}>
        <ActivityIndicator size="large" color={colorButtonFirst} />
        <Text style={styles.loadingText}>Chargement des informations...</Text>
      </View>
    );
  }

  if (error || !place) {
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

  const tranchesAge = place.ages.map(age => age.nom);
  const imageUrl = `${IMAGE_BASE_URL}${place.id}.jpg` || require("../assets/images/parc_montsouris.jpg");

  return (
    <SafeAreaView style={styles.safeArea}>
      <Row style={{ marginLeft: 0 }}>
        <BackButton style={styles.backButton} />
        {grade == 4 ? (
  <View style={stylesBt.deleteButtonContainer}>
    <View style={stylesBt.buttonWrapper}>
      <Button imageName={""} onPress={handleDelete} />
    </View>
  </View>
) : null}
      </Row>

      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.imageContainer}>
            <Image
              source={
                imageError
                  ? require('@/assets/images/Logo.png') // Utilise le logo comme image par défaut
                  : { uri: `${IMAGE_BASE_URL}${place.id}.jpg` }
              }
              style={styles.headerImage}
              onError={() => setImageError(true)}
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
                  <Text style={styles.note}>{place.note_moyenne.toFixed(1)}</Text>
                  <MaterialIcons
                    name="star"
                    size={18}
                    color="black"
                    style={styles.starIcon}
                  />
                  <Text style={styles.avis}>{place.nombre_commentaires} avis membres</Text>
                </View>
              </View>
              <ShareButton onPress={handleShare} />
            </View>

            <Text style={styles.nom}>{place.nom}</Text>
            <Text style={styles.description}>{place.description}</Text>
            <View style={styles.horairesContainer}>
              <Text style={styles.horaires}>{place.horaires}</Text>
            </View>
            <AgeBadges tranchesAge={tranchesAge} />
            <IconesLieux equipements={place.equipements} />

            <View style={styles.actionsContainer}>
              <View style={styles.rowButtons}>
                <AvisButton
                  type="donner"
                  nomLieu={place.nom}
                  lieuId={place.id.toString()}
                  onBeforeAction={handleDonnerAvis}


                />
                <AvisButton
                  type="voir"
                  nomLieu={place.nom}
                  lieuId={place.id.toString()}
                />
              </View>

              <LieuActionButtons
                onCall={handleCall}
                onWebsite={handleWebsite}
                onGps={handleGpsPress}
                telephone={place.adresse.telephone}
                siteWeb={place.adresse.site_web}
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

const stylesBt = StyleSheet.create({
  deleteButtonContainer: {
    position: 'absolute',
    right: 10,
    // Vous pouvez ajouter top, bottom, etc., selon le positionnement vertical souhaité
  },
  buttonWrapper: {
    // Styles supplémentaires pour l'enveloppe du bouton si nécessaire
  },
});

export default DetailsLieu;