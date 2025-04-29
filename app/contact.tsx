import React from "react";
import {
  View,
  Text,
  Linking,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "./types/navigation";
import { Title } from "@/components/Title";
import { colorButtonThird, colorFourth } from "./style/styles";
import { BurgerMenu } from "@/components/BurgerMenu/BurgerMenu";
import { Navigation } from "@/components/NavBar/Navigation";
import { styles } from '@/app/style/contact.styles'; 

// Données de l'équipe
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

// Constantes pour les icônes
const ICONS: {
  github: { name: 'github'; color: string };
  linkedin: { name: 'linkedin'; color: string };
} = {
  github: { name: 'github', color: 'black' },
  linkedin: { name: 'linkedin', color: '#0077B5' },
};

const ContactScreen = () => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  // Composant pour un membre de l'équipe
  const TeamMember = ({ member }: { member: (typeof TEAM_MEMBERS)[0] }) => (
    <View style={styles.member}>
      <Text style={styles.name}>{member.name}</Text>
      <View style={styles.iconsContainer}>
        <SocialIcon type="github" url={member.github} />
        <SocialIcon type="linkedin" url={member.linkedin} />
      </View>
    </View>
  );

  // Composant pour une icône sociale
  const SocialIcon = ({
    type,
    url,
  }: {
    type: keyof typeof ICONS;
    url: string;
  }) => {
    const iconName = ICONS[type].name;
    if (!['github', 'linkedin'].includes(iconName)) {
      throw new Error(`Nom d'icône invalide : ${iconName}`);
    }
  
    return (
      <TouchableOpacity
        onPress={() => Linking.openURL(url)}
        style={styles.iconButton}
        activeOpacity={0.7}
      >
        <FontAwesome
          name={iconName}
          size={24}
          color={ICONS[type].color}
          style={styles.icon}
        />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <BurgerMenu />
      <ScrollView contentContainerStyle={styles.container}>
        <Title text="Contactez-nous" />
        <View style={styles.content}>
          {TEAM_MEMBERS.map((member) => (
            <TeamMember key={member.name} member={member} />
          ))}
        </View>
      </ScrollView>
      <Navigation />
    </SafeAreaView>
  );
};



export default ContactScreen;
