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
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation"; // Assure-toi que ce fichier existe et est correct
import Layout from "./components/LayoutNav"; // Vérifie également ce chemin

const DetailsLieu = () => {
  const router = useRouter();
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

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
    <Layout
      activeTab="undefined"
      onMapPress={() => navigation.navigate("Map")}
      onCalendarPress={() => navigation.navigate("Calendar")}
      onAddPress={() => navigation.navigate("Add")}
      onFavoritePress={() => navigation.navigate("Favorites")}
    >
      <View style={styles.mainContainer}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
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
                  onPress={() =>
                    router.push({
                      pathname: "/avis",
                      params: { nomLieu: lieu.nom },
                    })
                  }
                >
                  <Text style={styles.smallButtonText}>Donner mon avis</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.smallButton, styles.voirAvisButton]}
                  onPress={() =>
                    router.push({
                      pathname: "/voir-avis",
                      params: { nomLieu: lieu.nom },
                    })
                  }
                >
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
    </Layout>
  );
};

export default DetailsLieu;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    paddingBottom: 24,
  },
  imageContainer: {
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: 200,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
  },
  favoriteIconContainer: {
    position: "absolute",
    top: 16,
    right: 16,
    backgroundColor: "rgba(0, 0, 0, 0.4)",
    borderRadius: 20,
    padding: 8,
  },
  centeredContent: {
    padding: 16,
  },
  ratingShareContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  ratingWrapper: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  note: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  },
  avis: {
    marginLeft: 4,
    fontSize: 14,
    color: "#666",
  },
  starIcon: {
    marginLeft: 4,
  },
  shareButton: {
    padding: 8,
    backgroundColor: "#eee",
    borderRadius: 8,
  },
  nom: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  horairesContainer: {
    marginBottom: 12,
  },
  horaires: {
    fontSize: 16,
    fontWeight: "500",
  },
  ageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 12,
    gap: 8,
  },
  ageBadge: {
    backgroundColor: "#E1F5FE",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  ageBadgeText: {
    color: "#0288D1",
    fontWeight: "600",
    fontSize: 14,
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 16,
    gap: 8,
  },
  actionsContainer: {
    marginTop: 16,
  },
  rowButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  smallButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  avisButton: {
    backgroundColor: "#A7F3D0",
  },
  voirAvisButton: {
    backgroundColor: "#BFDBFE",
  },
  smallButtonText: {
    color: "#000",
    fontWeight: "600",
  },
  newButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
    gap: 10,
  },
  iconButton: {
    alignItems: "center",
  },
  iconButtonText: {
    marginTop: 4,
    fontSize: 14,
    color: "#333",
  },
});

