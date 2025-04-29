import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Platform,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";

import { BurgerMenu } from "@/components/BurgerMenu/BurgerMenu";
import { Title } from "@/components/Title";
import { SubmitButton } from "@/app/components/Form/SubmitButton";
import { colorButtonFirst, colorButtonThird } from "./style/styles";
import { Navigation } from "@/components/NavBar/Navigation";

const About = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu />
      <View style={styles.outerContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.container}>
            <Title text="À propos" />

            <View style={styles.textContainer}>
              <Text style={styles.description}>
                "Une app pensée <Text style={styles.bold}>PAR</Text> des parents,{" "}
                <Text style={styles.bold}>POUR</Text> des parents !"
              </Text>
              <Text style={styles.description}>
                Kids Spot, c'est le GPS des sorties familiales & kids-friendly en
                Île-de-France !
              </Text>
              <Text style={styles.description}>
                Oubliez les recherches interminables et les déceptions : nous
                avons recensé pour vous de nombreuses adresses avec un critère
                imparable :
              </Text>
              <Text style={[styles.description, styles.bold]}>
                " Est-ce qu'on y emmènerait nos propres enfants ? "
              </Text>

              <Text style={styles.subtitle}>Pourquoi utiliser cette app ?</Text>

              <View style={styles.bulletPoint}>
                <MaterialIcons name="search" size={20} color="#555" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Sélection rigoureuse</Text> : Des
                  lieux kids-friendly testés sur le terrain par d'autres parents.
                </Text>
              </View>

              <View style={styles.bulletPoint}>
                <MaterialIcons name="star" size={20} color="#555" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Avis vérifiés</Text> : Seuls les
                  utilisateurs ayant visité peuvent noter.
                </Text>
              </View>

              <View style={styles.bulletPoint}>
                <MaterialIcons name="event" size={20} color="#555" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Actualisation permanente</Text> :
                  Nouveaux spots ajoutés régulièrement.
                </Text>
              </View>

              <View style={styles.bulletPoint}>
                <MaterialIcons name="filter-list" size={20} color="#555" />
                <Text style={styles.bulletText}>
                  <Text style={styles.bold}>Filtres intelligents</Text> : Par âge,
                  type de lieu et accessibilité.
                </Text>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <SubmitButton
                title="Nous contacter"
                onPress={() =>
                  navigation.navigate("Contact" as keyof RootStackParamList)
                }
              />
            </View>
          </View>
        </ScrollView>

        {/* Navbar toujours collée en bas */}
        <Navigation />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  outerContainer: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingBottom: 60, // correspond à la hauteur de la navbar
  },
  container: {
    padding: 20,
    backgroundColor: colorButtonThird,
  },
  textContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
    color: "#555",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colorButtonFirst,
    textAlign: "center",
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 10,
    color: "#555",
    flex: 1,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  buttonContainer: {
    marginBottom: 0, // évite l’espace sous le bouton
  },
});

export default About;
