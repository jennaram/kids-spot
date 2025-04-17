import React from "react";
import { useRouter } from 'expo-router';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from "react-native";

const DetailsLieu = () => {
  const router = useRouter();

  const lieu = {
    nom: "Parc Montsouris - Paris 14",
    description:
      "Grand parc avec aires de jeux pour enfants et espace pique-nique. Parfait pour les familles avec des enfants de tous âges.",
    horaires: "Tous les jours de 7h à 20h",
    note: "4.8",
    avis: "180 avis membres",
    tranchesAge: ["0-2 ans", "3-6 ans", "7 ans +"],
    imageUrl: require("../assets/images/parc_montsouris.jpg"),
  };

  function handleFavoriteToggle() {
    console.log("Favori cliqué");
  }

  function handleShare() {
    console.log("Partager cliqué");
  }

  return (
    <View style={styles.mainContainer}>
      {/* Contenu scrollable */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Image principale */}
        <View style={styles.imageContainer}>
          <Image
            source={lieu.imageUrl}
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
                <Text style={styles.note}>{lieu.note}</Text>
                <MaterialIcons
                  name="star"
                  size={18}
                  color="black"
                  style={styles.starIcon}
                />
                <Text style={styles.avis}>{lieu.avis}</Text>
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
            {lieu.tranchesAge.map((age, index) => (
              <View key={index} style={styles.ageBadge}>
                <Text style={styles.ageBadgeText}>{age}</Text>
              </View>
            ))}
          </View>
          
          <View style={styles.iconsContainer}>
            <MaterialIcons name="sports-soccer" size={30} color="#333" />
            <MaterialIcons name="stroller" size={30} color="#333" />
            <MaterialIcons name="microwave" size={30} color="#333" />
            <MaterialIcons name="baby-changing-station" size={30} color="#333" />
            <MaterialIcons name="restaurant" size={30} color="#333" />
          </View>
          
          <View style={styles.actionsContainer}>
            <View style={styles.rowButtons}>
              <TouchableOpacity
                style={[styles.smallButton, styles.avisButton]}
                onPress={() => {
                  const nomLieu = lieu.nom; 
                  router.push({
                    pathname: '/avis',
                    params: { nomLieu: nomLieu },
                  });
                }}>
                <Text style={styles.smallButtonText}>Donner mon avis</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.smallButton, styles.voirAvisButton]}
                onPress={() => {
                  const nomLieu = lieu.nom;
                  router.push({
                    pathname: '/voir-avis',
                    params: { nomLieu: nomLieu },
                  });
                }}>
                <Text style={styles.smallButtonText}>Voir les avis</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.newButtonsContainer}>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="phone" size={24} color="#333" />
                <Text style={styles.iconButtonText}>Appeler</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="language" size={24} color="#333" />
                <Text style={styles.iconButtonText}>Site web</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.iconButton}>
                <MaterialIcons name="place" size={24} color="#333" />
                <Text style={styles.iconButtonText}>Y aller</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
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
    color: "#D37230",
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
    backgroundColor: "#D37230",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  voirAvisButton: {
    backgroundColor: "#D37230",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
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
    backgroundColor: "#28603E",
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
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
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