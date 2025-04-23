import { Drawer } from "expo-router/drawer";
import { Image, View, Text, TouchableOpacity, StyleSheet, ToastAndroid, Platform, Alert } from "react-native";
import { ReactNode, useEffect } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { fontTitle } from "../style/styles";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import * as Linking from 'expo-linking';
import { drawerStyles as styles } from "./drawerStyles";

interface CustomDrawerLayoutProps {
  children: ReactNode;
}

// Configuration globale des routes
const ROUTES = {
  HOME: "/",
  PROFILE: "/profil",
  ADD_PLACE: "/add-place",
  ABOUT: "/about",
  CONTACT: "/contact",
  LOGIN: "/login"
};

export default function CustomDrawerLayout({
  children,
}: CustomDrawerLayoutProps) {
  const router = useRouter();
  
  // Effet pour intercepter les tentatives de navigation vers /profil
  // quand l'utilisateur appuie sur le bouton retour
  useEffect(() => {
    // Créer un écouteur d'URL qui peut intercepter les navigations
    const subscription = Linking.addEventListener('url', (event) => {
      const { path } = Linking.parse(event.url);
      
      // Si la navigation automatique tente d'aller vers /profil depuis une autre page
      // et que ce n'est pas une navigation explicite de l'utilisateur
      if (path === 'profil' && !event.url.includes('userInitiated=true')) {
        // Annuler cette navigation et revenir à la page d'accueil
        router.replace('/');
        return;
      }
    });
    
    return () => subscription.remove();
  }, []);

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
        // Force l'utilisation d'une seule instance de navigation, ce qui aide
        // à résoudre les problèmes de retour
        unmountOnBlur: false,
        // Désactiver l'historique de navigation pour ces écrans
        freezeOnBlur: true,
      }}
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      initialRouteName="index"
    >
      {/* Définir explicitement chaque écran avec ses options */}
      <Drawer.Screen
        name="index"
        options={{ 
          drawerItemStyle: { display: "none" },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="profil"
        options={{ 
          drawerItemStyle: { display: "none" },
          headerShown: false,
          // Ceci empêche l'écran de devenir le point de retour par défaut
          gestureEnabled: false
        }}
      />
      <Drawer.Screen
        name="add-place"
        options={{ 
          drawerItemStyle: { display: "none" },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="about"
        options={{ 
          drawerItemStyle: { display: "none" },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="contact"
        options={{ 
          drawerItemStyle: { display: "none" },
          headerShown: false
        }}
      />
      <Drawer.Screen
        name="logout"
        options={{ 
          drawerItemStyle: { display: "none" },
          headerShown: false
        }}
      />
      
      {children}
    </Drawer>
  );
}

type IconName = "person" | "add-circle" | "information-circle" | "mail" | "log-out" | "home";

interface MenuItem {
  name: string;
  icon: IconName;
  label: string;
  route: string;
}

function CustomDrawerContent(props: any) {
  const router = useRouter();
  const currentPath = usePathname();
  
  // Configuration des items du menu avec toutes les routes explicites
  const menuItems: MenuItem[] = [
    { name: "home", icon: "home", label: "Accueil", route: ROUTES.HOME },
    { name: "profil", icon: "person", label: "Mon profil", route: ROUTES.PROFILE },
    { name: "add-place", icon: "add-circle", label: "Ajouter un lieu", route: ROUTES.ADD_PLACE },
    { name: "about", icon: "information-circle", label: "À propos", route: ROUTES.ABOUT },
    { name: "contact", icon: "mail", label: "Contact", route: ROUTES.CONTACT },
  ];

  const handleNavigation = (item: MenuItem) => {
    // Fermer le drawer d'abord
    props.navigation.closeDrawer();
    
    if (item.name === "logout") {
      // Afficher un toast pour la déconnexion
      if (Platform.OS === "android") {
        ToastAndroid.show("Vous êtes déconnecté", ToastAndroid.SHORT);
      } else {
        Alert.alert("Déconnexion", "Vous êtes déconnecté");
      }
      
      // Effacer complètement l'historique de navigation
      router.replace(ROUTES.LOGIN);
      return;
    }
    
    // Éviter la navigation redondante
    if (currentPath !== item.route) {
      // Ajouter un paramètre pour indiquer que c'est une navigation explicite
      // Cela aide notre intercepteur à distinguer les navigations manuelles
      const userInitiatedParam = `?userInitiated=true`;
      router.push(item.route + userInitiatedParam);
    }
  };

  return (
    <DrawerContentScrollView {...props} contentContainerStyle={styles.container}>
      <View style={styles.menuSection}>
        {/* En-tête du menu */}
        <View
          style={[
            styles.header,
            {
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "flex-start", // Aligne les éléments sur la gauche
            },
          ]}
        >
          <Image
            source={require("../../assets/images/Logo.png")}
            style={styles.logoImage}
          />
          <Text style={[fontTitle, { marginLeft: 10 }]}>Kids Spot</Text>
        </View>
        
        {/* Items principaux */}
        {menuItems.map((item) => {
          // Détermine si cet item est actif en fonction du chemin actuel
          const isActive = currentPath === item.route;
          
          return (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.menuItem,
                isActive && styles.activeItem,
              ]}
              onPress={() => handleNavigation(item)}
            >
              <Ionicons
                name={item.icon}
                size={22}
                color={isActive ? "#2563eb" : "#333"}
              />
              <Text style={styles.menuText}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
      
      {/* Section déconnexion (toujours en bas) */}
      <TouchableOpacity
        style={styles.logoutItem}
        onPress={() => handleNavigation({ 
          name: "logout", 
          icon: "log-out", 
          label: "Déconnexion",
          route: ROUTES.LOGIN
        })}
      >
        <Ionicons name="log-out" size={22} color="#d9534f" />
        <Text style={styles.logoutText}>Déconnexion</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}