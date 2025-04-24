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
import MenuBurger from "./components/menuburger";
import { Title } from '@/components/Title';
import { 
  colorButtonFirst, 
  colorButtonSecondary, 
  colorButtonThird, 
  colorFourth, 
  fontSubtitle,
  fontTitle 
} from './style/styles';

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
    name: "Sebastien Drillaud",
    github: "https://github.com/Seb-Prod",
    linkedin: "https://www.linkedin.com/in/s%C3%A9bastien-drillaud-b68b3318a/",
  },
  {
    name: "Ludovic Denis",
    github: "https://github.com/Ludus78",
    linkedin: "https://www.linkedin.com/in/ludovic-denis-698b97196/",
  },
];

export default function ContactScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.safeArea}>
      <MenuBurger />
      <Layout
        activeTab="undefined"
        onMapPress={() => navigation.navigate("Map")}
        onCalendarPress={() => navigation.navigate("Calendar")}
        onAddPress={() => navigation.navigate("Add")}
        onFavoritePress={() => navigation.navigate("Favorites")}
      >
        <ScrollView contentContainerStyle={styles.container}>
          <Title text="Contact" />
          
          <View style={styles.content}>
            <Text style={styles.subtitle}>Projet réalisé par :</Text>
            
            {teamMembers.map((member) => (
              <View key={member.name} style={styles.member}>
                <Text style={styles.name}>{member.name}</Text>
                <View style={styles.iconsContainer}>
                  <TouchableOpacity 
                    onPress={() => Linking.openURL(member.github)}
                    style={styles.iconButton}
                  >
                    <FontAwesome
                      name="github"
                      size={24}
                      color="black"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => Linking.openURL(member.linkedin)}
                    style={styles.iconButton}
                  >
                    <FontAwesome
                      name="linkedin"
                      size={24}
                      color="#0077B5"
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </Layout>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: colorButtonThird,
  },
  content: {
    marginTop: 20,
  },
  subtitle: {
    fontSize: 18,
    marginBottom: 20,
    textAlign: "center",
    color: colorButtonFirst,
    fontWeight: 'bold',
  },
  member: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 15,
    backgroundColor: colorFourth,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  iconsContainer: {
    flexDirection: "row",
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    marginHorizontal: 5,
  },
});