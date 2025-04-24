
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
  ActivityIndicator
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import Layout from "./components/LayoutNav";
import { Share } from 'react-native';
import { Alert, Platform, Linking } from 'react-native';
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth, fontSubtitle } from './style/styles';
import { fontTitle, loadFonts } from './style/styles';
import { IconesLieux } from '@/components/IconesLieux';

// Interface pour les données récupérées de l'API
interface Lieu {
  id: number;
  nom: string;
  description: string;
  horaires: string;
  adresse: {
    adresse: string;
    ville: string;
    code_postal: string;
    telephone?: string;
    site_web?: string;
  };
  type: {
    id: number;
    nom: string;
  }[];
  est_evenement: boolean;
  date_evenement?: {
    debut: string | null;
    fin: string | null;
  };
  position: {
    latitude: number;
    longitude: number;
  };
  equipements: {
    id: number;
    nom: string;
  }[];
  ages: {
    id: number;
    nom: string;
  }[];
  commentaires?: {
    pseudo: string;
    commentaire: string;
    note: number;
    date_ajout: string;
  }[];
  note_moyenne: number;
  nombre_commentaires: number;
  image_url?: string;
}

// Interface pour la réponse de l'API
interface ApiResponse {
  status: string;
  data: Lieu;
}

const DetailsLieu = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const lieuId = params.id?.toString() || "2"; // Utiliser l'ID passé en paramètre ou "1" par défaut
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
    <Layout
      activeTab={undefined}
      onMapPress={() => navigation.navigate('Map')}
      onCalendarPress={() => navigation.navigate('Calendar')}
      onAddPress={() => navigation.navigate('Add')}
      onFavoritePress={() => navigation.navigate('Favorites')}
    >
      <View style={styles.mainContainer}>
        {/* Contenu scrollable */}
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          {/* Image principale */}
          <View style={styles.imageContainer}>
            <Image
              source={typeof imageUrl === 'string' ? { uri: imageUrl } : imageUrl}
              style={styles.headerImage}
              resizeMode="cover"
            />
            <View style={styles.favoriteIconContainer}>
              <TouchableOpacity onPress={handleFavoriteToggle}>
                <MaterialIcons name="favorite-border" size={24} color="white" />
              </TouchableOpacity>
            </View>
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
              <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
                <MaterialIcons name="share" size={24} color="#333" />
              </TouchableOpacity>
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
                <TouchableOpacity
                  style={[styles.smallButton, styles.avisButton]}
                  onPress={() => {
                    router.push({
                      pathname: '/avis',
                      params: { nomLieu: lieu.nom, lieuId: lieu.id },
                    });
                  }}>
                  <Text style={styles.smallButtonText}>Donner mon avis</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallButton, styles.voirAvisButton]}
                  onPress={() => {
                    router.push({
                      pathname: '/voir-avis',
                      params: { nomLieu: lieu.nom, lieuId: lieu.id },
                    });
                  }}>
                  <Text style={styles.smallButtonText}>Voir les avis</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.newButtonsContainer}>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={handleCall}
                  disabled={!lieu.adresse.telephone}
                >
                  <MaterialIcons name="phone" size={24} color={lieu.adresse.telephone ? "#333" : "#999"} />
                  <Text style={[styles.iconButtonText, !lieu.adresse.telephone && styles.disabledText]}>Appeler</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.iconButton}
                  onPress={handleWebsite}
                  disabled={!lieu.adresse.site_web}
                >
                  <MaterialIcons name="language" size={24} color={lieu.adresse.site_web ? "#333" : "#999"} />
                  <Text style={[styles.iconButtonText, !lieu.adresse.site_web && styles.disabledText]}>Site web</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton} onPress={handleGpsPress}>
                  <MaterialIcons name="place" size={24} color="#333" />
                  <Text style={styles.iconButtonText}>Y aller</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Layout>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  disabledText: {
    color: "#999", // Gray color for disabled text
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
  shareButton: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 8,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1,
  },
  avisButton: {
    backgroundColor: colorButtonFirst,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 5,
  },
  voirAvisButton: {
    backgroundColor: colorButtonFirst,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    marginHorizontal: 5,
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
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  smallButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    marginHorizontal: 5,
  },
  smallButtonText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
  newButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  iconButton: {
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    flex: 1,
    marginHorizontal: 10,
  },
  iconButtonText: {
    fontSize: 12,
    color: "#333",
    marginTop: 5,
    textAlign: "center",
  },
  favoriteIconContainer: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    borderRadius: 20,
    padding: 5,
    zIndex: 10,
  },
  ratingWrapper: {
    flex: 1,
    alignItems: "center",
  },
});

export default DetailsLieu;