import React from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Platform,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import { Title } from "@/components/Title";
import { Navigation } from "@/components/NavBar/Navigation";
import { styles } from '@/app/style/contact.styles'; 
import { BackButton } from './components/BackButton';

// LISTE COMPLÈTE DE TOUS VOS CONTACTS
const TEAM_MEMBERS = [
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
    name: "Sébastien Drillaud",
    github: "https://github.com/Seb-Prod",
    linkedin: "https://www.linkedin.com/in/s%C3%A9bastien-drillaud-b68b3318a/",
  },
  {
    name: "Ludovic Denis",
    github: "https://github.com/Ludus78",
    linkedin: "https://www.linkedin.com/in/ludovic-denis-698b97196/",
  },
];

const ContactScreen = () => {
  return (
    <SafeAreaView style={styles.safeArea}>
      {/* BOUTON RETOUR EN HAUT À GAUCHE */}
      <View style={{
        position: 'absolute',
        top: Platform.select({ ios: 10, android: 5 }), // Position ultra-haute
        left: 10,
        zIndex: 100,
      }}>
        <BackButton onPress={() => router.back()} />
      </View>

      <ScrollView 
        contentContainerStyle={[styles.container, { paddingTop: 50 }]}
        showsVerticalScrollIndicator={false}
      >
        <Title text="Contactez-nous" />
        
        {/* LISTE COMPLÈTE DES CONTACTS */}
        <View style={styles.content}>
          {TEAM_MEMBERS.map((member, index) => (
            <View key={index} style={styles.member}>
              <Text style={styles.name}>{member.name}</Text>
              <View style={styles.iconsContainer}>
                <TouchableOpacity 
                  onPress={() => Linking.openURL(member.github)}
                  style={styles.iconButton}
                >
                  <FontAwesome name="github" size={24} color="black" />
                </TouchableOpacity>
                <TouchableOpacity 
                  onPress={() => Linking.openURL(member.linkedin)}
                  style={styles.iconButton}
                >
                  <FontAwesome name="linkedin" size={24} color="#0077B5" />
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      <Navigation />
    </SafeAreaView>
  );
};

export default ContactScreen;