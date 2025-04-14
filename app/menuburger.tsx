import React, { useState } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import Icon from "react-native-vector-icons/MaterialIcons"; // Import des icônes

const MenuBurger = () => {
  const [menuVisible, setMenuVisible] = useState(false);
  const router = useRouter();

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
  };

  const handleNavigation = (route: string) => {
    setMenuVisible(false); // Fermer le menu après la navigation
    router.push(route); // Naviguer vers la route spécifiée
  };

  return (
    <View style={styles.container}>
      {/* Icône du menu burger */}
      <TouchableOpacity onPress={toggleMenu}>
        <Image
          source={require("../assets/images/burger_menu.png")}
          style={styles.menuIcon}
        />
      </TouchableOpacity>

      {/* Menu déroulant */}
      {menuVisible && (
        <View style={styles.menu}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("/profile")}
          >
            <Icon name="person" size={20} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>Mon profil</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("/add-place")}
          >
            <Icon name="add-location" size={20} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>Ajouter un lieu</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("/about")}
          >
            <Icon name="info" size={20} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>À propos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("/contact")}
          >
            <Icon name="mail" size={20} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>Contact</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => handleNavigation("/logout")}
          >
            <Icon name="logout" size={20} color="#333" style={styles.icon} />
            <Text style={styles.menuText}>Déconnexion</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 20,
    left: 20,
    zIndex: 10,
  },
  menuIcon: {
    width: 30,
    height: 30,
  },
  menu: {
    marginTop: 10,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    padding: 10,
  },
  menuItem: {
    flexDirection: "row", // Aligner les icônes et le texte horizontalement
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  icon: {
    marginRight: 10, // Espacement entre l'icône et le texte
  },
  menuText: {
    fontSize: 16,
    color: "#333",
  },
});

export default MenuBurger;