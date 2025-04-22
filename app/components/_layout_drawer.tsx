import { Drawer } from "expo-router/drawer";
import { Image, View, Text, TouchableOpacity, StyleSheet, ToastAndroid, Platform, Alert } from "react-native";
import { ReactNode, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useNavigationContainerRef } from "expo-router";
import { fontTitle, loadFonts } from '../style/styles';

interface CustomDrawerLayoutProps {
  children: ReactNode;
}

export default function CustomDrawerLayout({ children }: CustomDrawerLayoutProps) {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: "left",
        drawerType: "slide",
        headerShown: false,
        swipeEnabled: true,
        drawerStyle: {
          width: "75%",
          justifyContent: "space-between",
        },
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
    >
      {/* Masquer tous les éléments par défaut */}
      <Drawer.Screen
        name="profil"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="add-place"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="about"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="contact"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      <Drawer.Screen
        name="logout"
        options={{ drawerItemStyle: { display: "none" } }}
      />
      
      {children}
    </Drawer>
  );
}

function CustomDrawerContent(props: any) {
  const router = useRouter();
  
  // Configuration des items du menu avec typage correct pour les icônes
  const mainMenuItems = [
    { name: "profil", icon: "person" as const, label: "Mon profil" },
    { name: "add-place", icon: "add-circle" as const, label: "Ajouter un lieu" },
    { name: "about", icon: "information-circle" as const, label: "À propos" },
    { name: "contact", icon: "mail" as const, label: "Contact" },
  ];

  const handleNavigation = (name: string) => {
    if (name === "logout") {
      // Afficher un toast pour la déconnexion
      if (Platform.OS === "android") {
        ToastAndroid.show("Vous êtes déconnectés", ToastAndroid.SHORT);
      } else {
        Alert.alert("Déconnexion", "Vous êtes déconnectés");
      }
      router.replace("/login");
    } else if (name === "profil") {
      router.push("/profil");
    } else if (name === "contact") {
      router.push("/contact");
    } else {
      props.navigation.navigate(name);
    }
    props.navigation.closeDrawer();
  };

  return (
    <View style={styles.container}>
      <View style={styles.menuSection}>
        {/* En-tête du menu */}
        <View style={styles.header}>
          <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.logoImage}
          />
          <Text style={[fontTitle]}>Kids Spot</Text>
        </View>
        
        {/* Items principaux */}
        {mainMenuItems.map((item) => (
          <TouchableOpacity
            key={item.name}
            style={[
              styles.menuItem,
              props.state.routeNames[props.state.index] === item.name &&
                styles.activeItem,
            ]}
            onPress={() => handleNavigation(item.name)}
          >
            <Ionicons
              name={item.icon}
              size={22}
              color={
                props.state.routeNames[props.state.index] === item.name
                  ? "#2563eb"
                  : "#333"
              }
            />
            <Text style={styles.menuText}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      
      {/* Section déconnexion (toujours en bas) */}
      <TouchableOpacity
        style={styles.logoutItem}
        onPress={() => handleNavigation("logout")}
      >
        <Ionicons name={"log-out" as const} size={22} color="#d9534f" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  menuSection: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  activeItem: {
    backgroundColor: "#f0f7ff",
    borderRightWidth: 3,
    borderRightColor: "#2563eb",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginHorizontal: 10,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#d9534f",
    fontWeight: "500",
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
});