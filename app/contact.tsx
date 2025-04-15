import React from "react";
import { View, Text, Linking, TouchableOpacity, StyleSheet } from "react-native";
import { FontAwesome } from "@expo/vector-icons"; // Si tu utilises Expo

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
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Contact</Text>
      <Text style={styles.subtitle}>Projet réalisé par :</Text>
      {teamMembers.map((member) => (
        <View key={member.name} style={styles.member}>
          <Text style={styles.name}>{member.name}</Text>
          <TouchableOpacity onPress={() => Linking.openURL(member.github)}>
            <FontAwesome name="github" size={24} color="black" style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(member.linkedin)}>
            <FontAwesome name="linkedin" size={24} color="#0077B5" style={styles.icon} />
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    marginTop: 50,
    backgroundColor: "#fff",
    flex: 1,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
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
    gap: 10,
  },
  name: {
    fontSize: 18,
    flex: 1,
  },
  icon: {
    marginHorizontal: 5,
  },
});
