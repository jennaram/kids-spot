import React from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation"; 
import Layout from "./components/LayoutNav"; 
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth, fontSubtitle } from './style/styles';
import { fontTitle, loadFonts } from './style/styles';

const teamMembers = [
  {
    name: "Jenna Ramiaramanantsoa",
    github: "https://github.com/jennaram",
    linkedin: "https://www.linkedin.com/in/jennabenufferamia/",
  },
  {
    name: "Alexandre Fourquin",
    github: "https://github.com/alexandre94420",
    linkedin: "https://www.linkedin.com/in/alexandre-fourquin-5ba470187/",
  },
  {
    name: "Moussa Kebe",
    github: "https://github.com/Moussa406",
    linkedin: "https://www.linkedin.com/in/moussa-kebe-b36ba9226/",
  },
  {
    name: "Sebastien",
    github: "https://github.com/Seb-Prod",
    linkedin: "https://www.linkedin.com/in/s%C3%A9bastien-drillaud-b68b3318a/",
  },
  {
    name: "Ludovic",
    github: "https://github.com/Ludus78",
    linkedin: "https://www.linkedin.com/in/ludovic-denis-698b97196/",
  },
];

export default function ContactScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Layout
      activeTab="undefined" // Ou une valeur valide selon ton layout (ex: "contact", "profile", etc.)
      onMapPress={() => navigation.navigate("Map")}
      onCalendarPress={() => navigation.navigate("Calendar")}
      onAddPress={() => navigation.navigate("Add")}
      onFavoritePress={() => navigation.navigate("Favorites")}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[fontTitle]}>Contact</Text>
        <Text style={styles.subtitle}>Projet réalisé par :</Text>
        {teamMembers.map((member) => (
          <View key={member.name} style={styles.member}>
            <Text style={styles.name}>{member.name}</Text>
            <TouchableOpacity onPress={() => Linking.openURL(member.github)}>
              <FontAwesome
                name="github"
                size={24}
                color="black"
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => Linking.openURL(member.linkedin)}>
              <FontAwesome
                name="linkedin"
                size={24}
                color="#0077B5"
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: colorButtonThird,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
  },
  member: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  name: {
    fontSize: 18,
    flex: 1,
  },
  icon: {
    marginHorizontal: 5,
  },
});
