import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      {/* Bouton de partage au-dessus */}
      <View style={styles.shareButtonContainer}>
        <TouchableOpacity style={styles.shareButton}>
          <MaterialIcons name="share" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      {/* Conteneur de l'image */}
      <View style={styles.imageContainer}>
        <Image
          source={lieu.imageUrl}
          style={styles.headerImage}
          resizeMode="cover"
        />
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
              <Text style={styles.ageText}>{age}</Text>
            </View>
          ))}
        </View>

        {/* Conteneur des icônes */}
        <View style={styles.iconsContainer}>
          <MaterialIcons name="play" size={30} color="#333" />
          <MaterialIcons name="stroller" size={30} color="#333" />
          <MaterialIcons name="microwave" size={30} color="#333" />
          <MaterialIcons name="baby-changing-station" size={30} color="#333" />
          <MaterialIcons name="chair-alt" size={30} color="#333" />
        </View>

        {/* Boutons d'action */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={[styles.button, styles.avisButton]}>
            <Text style={styles.buttonText}>Donner mon avis</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.voirAvisButton]}>
            <Text style={styles.buttonText}>Voir les avis</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.yAllerButton]}>
            <Text style={styles.buttonText}>Y aller</Text>
          </TouchableOpacity>
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
  },
  headerImage: {
    width: "100%",
    height: 250,
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
    color: "#FFD700",
    fontWeight: "bold",
    marginRight: 10,
  },
  avis: {
    fontSize: 14,
    color: "gray",
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
    backgroundColor: "#f0f0f0",
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  ageText: {
    fontSize: 14,
    color: "#333",
  },
  actionsContainer: {
    width: "100%",
    maxWidth: 400,
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 12,
  },
  avisButton: {
    backgroundColor: "#f0f0f0",
  },
  voirAvisButton: {
    backgroundColor: "#e0e0e0",
  },
  yAllerButton: {
    backgroundColor: "#FFA500",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  starIcon: {
    marginLeft: 5,
    marginRight: 5,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 20,
    width: "100%",
    maxWidth: 400,
  },
});

export default DetailsLieu;
