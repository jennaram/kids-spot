import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/FontAwesome";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";

const DetailsLieu = ({ route, navigation }) => {
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

  function handleFavoriteToggle(event: GestureResponderEvent): void {
    throw new Error("Function not implemented.");
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Bouton de partage au-dessus */}
      <View style={styles.shareButtonContainer}>
        <TouchableOpacity style={styles.shareButton}>
          <MaterialIcons name="share" size={24} color="#333" />
        </TouchableOpacity>
      </View>

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

      {/* Contenu centré */}
      <View style={styles.centeredContent}>
        {/* Note et avis */}
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

        {/* Nom du lieu */}
        <Text style={styles.nom}>{lieu.nom}</Text>

        {/* Description */}
        <Text style={styles.description}>{lieu.description}</Text>

        {/* Horaires */}
        <View style={styles.horairesContainer}>
          <Text style={styles.horaires}>{lieu.horaires}</Text>
        </View>

        {/* Tranches d'âge */}
        <View style={styles.ageContainer}>
          {lieu.tranchesAge.map((age, index) => (
            <View key={index} style={styles.ageBadge}>
              <Text style={styles.ageBadgeText}>{age}</Text>
            </View>
          ))}
        </View>

        {/* Conteneur des icônes */}
        <View style={styles.iconsContainer}>
          <MaterialIcons name="sports-soccer" size={30} color="#333" />
          <MaterialIcons name="stroller" size={30} color="#333" />
          <MaterialIcons name="microwave" size={30} color="#333" />
          <MaterialIcons name="baby-changing-station" size={30} color="#333" />
          <MaterialIcons name="restaurant" size={30} color="#333" />
        </View>

        {/* Boutons et icônes */}
        <View style={styles.actionsContainer}>
          {/* Boutons "Donner mon avis" et "Voir les avis" alignés */}
          <View style={styles.rowButtons}>
            <TouchableOpacity style={[styles.smallButton, styles.avisButton]}>
              <Text style={styles.smallButtonText}>Donner mon avis</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.smallButton, styles.voirAvisButton]}
            >
              <Text style={styles.smallButtonText}>Voir les avis</Text>
            </TouchableOpacity>
          </View>

          {/* Icônes alignées horizontalement */}
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
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  shareButtonContainer: {
    alignItems: "flex-end",
    padding: 10,
    backgroundColor: "white",
  },
  shareButton: {
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 20,
    padding: 8,
  },
  imageContainer: {
    width: "100%",
    marginTop: 10,
    padding: 15,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    position: "relative", // Permet le positionnement absolu des enfants
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
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    marginBottom: 10,
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
    marginRight: 10,
  },
  avisButton: {
    backgroundColor: "#D37230", // Couleur de fond orange
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    alignItems: "center",
    marginHorizontal: 5,
  },
  voirAvisButton: {
    backgroundColor: "#D37230", // Couleur de fond orange
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
    backgroundColor: "#f0f0f0",
  },
  smallButtonText: {
    color: "white", // Texte blanc
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
    position: "absolute", // Position absolue pour placer l'icône
    top: 20, // Distance depuis le haut
    right: 20, // Distance depuis la droite
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fond semi-transparent
    borderRadius: 20,
    padding: 5,
    zIndex: 10,
  },
});

export default DetailsLieu;