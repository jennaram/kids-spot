import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import MenuBurger from "../app/components/menuburger";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation"; // Assure-toi que ce fichier existe et contient la bonne définition
import Layout from "./components/LayoutNav"; // Remplace par le bon chemin si besoin

const About = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const handleMenuPress = () => {
    Alert.alert("Menu", "Menu burger cliqué !");
  };

  return (
    <Layout
      activeTab="undefined"
      onMapPress={() => navigation.navigate("Map")}
      onCalendarPress={() => navigation.navigate("Calendar")}
      onAddPress={() => navigation.navigate("Add")}
      onFavoritePress={() => navigation.navigate("Favorites")}
    >
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <MenuBurger onPress={handleMenuPress} />
          <Text style={styles.title}>À propos</Text>
          <View style={{ width: 30 }} />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.description}>
            "Une app pensée <Text style={styles.bold}>PAR</Text> des parents,{" "}
            <Text style={styles.bold}>POUR</Text> des parents !"
          </Text>
          <Text style={styles.description}>
            Kids Spot, c'est le GPS des sorties familiales & kids-friendly en Île-de-France !
          </Text>
          <Text style={styles.description}>
            Oubliez les recherches interminables et les déceptions : nous avons recensé pour vous de nombreuses adresses avec un critère imparable :
          </Text>
          <Text style={[styles.description, styles.bold]}>
            " Est-ce qu'on y emmènerait nos propres enfants ? "
          </Text>

          <Text style={styles.subtitle}>Pourquoi utiliser cette app ?</Text>

          <View style={styles.bulletPoint}>
            <MaterialIcons name="search" size={20} color="#555" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Sélection rigoureuse</Text> : Des lieux kids-friendly testés sur le terrain par d’autres parents.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <MaterialIcons name="star" size={20} color="#555" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Avis vérifiés</Text> : Seuls les utilisateurs ayant visité peuvent noter.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <MaterialIcons name="event" size={20} color="#555" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Actualisation permanente</Text> : Nouveaux spots ajoutés régulièrement.
            </Text>
          </View>

          <View style={styles.bulletPoint}>
            <MaterialIcons name="filter-list" size={20} color="#555" />
            <Text style={styles.bulletText}>
              <Text style={styles.bold}>Filtres intelligents</Text> : Par âge, type de lieu et accessibilité.
            </Text>
          </View>
        </View>

        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Nous contacter</Text>
        </TouchableOpacity>
      </ScrollView>
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    flex: 1,
  },
  textContainer: {
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 10,
    color: "#555",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#D37230",
    textAlign: "center",
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 10,
  },
  bulletText: {
    fontSize: 16,
    lineHeight: 24,
    marginLeft: 10,
    color: "#555",
    flex: 1,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  button: {
    marginTop: 20,
    backgroundColor: "#D37230",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default About;
