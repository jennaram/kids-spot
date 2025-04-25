import React from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import Layout from "./components/LayoutNav";
import { BurgerMenu } from '@/components/BurgerMenu/BurgerMenu';
import { Title } from '@/components/Title';
import { 
  colorButtonFirst, 
  colorButtonSecondary, 
  colorButtonThird, 
  colorFourth, 
  fontSubtitle,
  fontTitle 
} from './style/styles';

const About = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.safeArea}>
      <BurgerMenu/>
      <Layout
        activeTab="undefined"
        onMapPress={() => navigation.navigate("Map")}
        onCalendarPress={() => navigation.navigate("Calendar")}
        onAddPress={() => navigation.navigate("Add")}
        onFavoritePress={() => navigation.navigate("Favorites")}
      >
        <ScrollView style={styles.container}>
          <Title text="À propos" />

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
                <Text style={styles.bold}>Sélection rigoureuse</Text> : Des lieux kids-friendly testés sur le terrain par d'autres parents.
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

          <TouchableOpacity 
            style={styles.button}
            onPress={() => navigation.navigate('Contact')} // Adaptez selon votre navigation
          >
            <Text style={styles.buttonText}>Nous contacter</Text>
          </TouchableOpacity>
        </ScrollView>
      </Layout>
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: colorButtonThird,
  },
  textContainer: {
    backgroundColor: "white",
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
    color: colorButtonFirst,
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
    backgroundColor: colorButtonFirst,
    padding: 15,
    borderRadius: 15,
    alignItems: "center",
  },
  buttonText: {
    color: colorButtonThird,
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default About;