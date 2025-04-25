
import React, { useEffect, useState } from "react";
import { useRouter, useLocalSearchParams } from 'expo-router';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  SafeAreaView
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import Layout from "./components/LayoutNav";
import { Share } from 'react-native';
import { Alert, Platform, Linking } from 'react-native';
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth, fontSubtitle } from './style/styles';
import { IconesLieux } from '@/components/IconesLieux';
import { Navigation } from "@/components/Navigation";
import MenuBurger from "./components/menuburger";
import { Lieu } from "./types/lieu";
import { AvisButton } from "../components/Lieux/AvisButton";
import LieuActionButtons from "../components/Lieux/LieuActionButtons";
import ShareButton from "../components/Lieux/ShareButton";
import FavoriteButton from "@/components/Lieux/FavoriteButton";
// Interface pour les données récupérées de l'API


// Interface pour la réponse de l'API
interface ApiResponse {
  status: string;
  data: Lieu;
}

const DetailsLieu = () => {
  const router = useRouter();
  const params = useLocalSearchParams() as {id:string};
  const lieuId = params.id?.toString() || "2";
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [lieu, setLieu] = useState<Lieu | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchLieuDetails = async () => {
      try {
        setLoading(true);
        console.log(`Récupération des données pour l'ID: ${lieuId}`);
        
        const response = await fetch(`https://seb-prod.alwaysdata.net/kidsspot/lieux/${lieuId}`);
        
        if (!response.ok) {
          throw new Error(`Erreur lors de la récupération des données: ${response.status}`);
        }
        
        const result: ApiResponse = await response.json();
        console.log('Données reçues:', JSON.stringify(result, null, 2));
        
        if (!result.data) {
          throw new Error('Données non trouvées dans la réponse API');
        }
        
        // Vérifier que les champs obligatoires sont présents
        if (!result.data.nom || !result.data.description) {
          throw new Error('Les données du lieu sont incomplètes');
        }
        
        setLieu({
          ...result.data,
          // Fournir des valeurs par défaut pour les propriétés potentiellement manquantes
          equipements: result.data.equipements || [],
          ages: result.data.ages || [],
          note_moyenne: result.data.note_moyenne || 0,
          nombre_commentaires: result.data.nombre_commentaires || 0,
          adresse: {
            ...result.data.adresse,
            telephone: result.data.adresse?.telephone || '',
            site_web: result.data.adresse?.site_web || '',
          }
        });
      } catch (err) {
        console.error("Erreur lors de la récupération des détails du lieu:", err);
        setError(`Impossible de charger les détails du lieu (ID: ${lieuId})`);
      } finally {
        setLoading(false);
      }
    };

    fetchLieuDetails();
  }, [lieuId]);

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

  function handleFavoriteToggle() {
    console.log("Favori cliqué");
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
      <Layout
        activeTab={undefined}
        onMapPress={() => navigation.navigate('Map')}
        onCalendarPress={() => navigation.navigate('Calendar')}
        onAddPress={() => navigation.navigate('Add')}
        onFavoritePress={() => navigation.navigate('Favorites')}
      >
        <View style={[styles.mainContainer, styles.loadingContainer]}>
          <ActivityIndicator size="large" color={colorButtonFirst} />
          <Text style={styles.loadingText}>Chargement des informations...</Text>
        </View>
      </Layout>
    );
  }

  // Affiche un message d'erreur si le chargement a échoué
  if (error || !lieu) {
    return (
      <Layout
        activeTab={undefined}
        onMapPress={() => navigation.navigate('Map')}
        onCalendarPress={() => navigation.navigate('Calendar')}
        onAddPress={() => navigation.navigate('Add')}
        onFavoritePress={() => navigation.navigate('Favorites')}
      >
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
      </Layout>
    );
  }

  // Convertir les tranches d'âge en format d'affichage
  const tranchesAge = lieu.ages.map(age => age.nom);

  // Image par défaut si aucune n'est fournie
  const imageUrl = lieu.image_url || require("../assets/images/parc_montsouris.jpg");
  
  return (
    <SafeAreaView style={styles.safeArea}>
      <MenuBurger/>
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
              onToggle={handleFavoriteToggle}
            />
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
            
            <View style={styles.ageContainer}>
              {tranchesAge.map((age, index) => (
                <View key={index} style={styles.ageBadge}>
                  <Text style={styles.ageBadgeText}>{age}</Text>
                </View>
              ))}
            </View>
            {/* Utilisation du composant IconesLieux avec les équipements du lieu */}
            <IconesLieux equipements={lieu.equipements} />
            
            <View style={styles.actionsContainer}>
              <View style={styles.rowButtons}>
                <AvisButton type="donner" nomLieu={lieu.nom} lieuId={lieu.id.toString()} />
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
      <Navigation/>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
},
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
 
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8d7da",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colorButtonFirst,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 16,
    color: "#721c24",
    textAlign: "center",
    marginTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    width: "100%",
    marginTop: 10,
    padding: 15,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: 250,
    borderRadius: 15,
  },
  centeredContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  ratingShareContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nom: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  note: {
    fontSize: 18,
    color: colorButtonFirst,
    fontWeight: "bold",
    marginRight: 5,
  },
  starIcon: {
    marginRight: 5,
  },
  avis: {
    fontSize: 16,
    color: "#333",
  },
 
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  horairesContainer: {
    marginBottom: 20,
  },
  horaires: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  ageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 25,
  },
  ageBadge: {
    backgroundColor: colorButtonSecondary,
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  ageBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  actionsContainer: {
    width: "100%",
    maxWidth: 400,
    marginTop: 20,
  },
 
  
  ratingWrapper: {
    flex: 1,
    alignItems: "center",
  },
});

export default DetailsLieu;