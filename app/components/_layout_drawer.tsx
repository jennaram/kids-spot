import { Drawer } from 'expo-router/drawer';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CustomDrawerLayout() {
  return (
    <Drawer
      screenOptions={{
        drawerPosition: 'left',
        drawerType: 'slide',
        headerShown: false,
        swipeEnabled: true,
        drawerStyle: {
          width: '75%', // Contrôle la largeur du drawer
        },
      }}
    >
      {/* Écran Accueil (optionnel) */}
      <Drawer.Screen
        name="index"
        options={{
          drawerLabel: 'Accueil',
          title: 'Accueil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="home" size={size} color={color} />
          ),
        }}
      />

      {/* Profil */}
      <Drawer.Screen
        name="profile"
        options={{
          drawerLabel: 'Mon profil',
          title: 'Mon profil',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="person" size={size} color={color} />
          ),
        }}
      />

      {/* Ajouter un lieu */}
      <Drawer.Screen
        name="add-place"
        options={{
          drawerLabel: 'Ajouter un lieu',
          title: 'Ajouter un lieu',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="add-circle" size={size} color={color} />
          ),
        }}
      />

      {/* À propos */}
      <Drawer.Screen
        name="about"
        options={{
          drawerLabel: 'À propos',
          title: 'À propos',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />

      {/* Contact */}
      <Drawer.Screen
        name="contact"
        options={{
          drawerLabel: 'Contact',
          title: 'Contact',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="mail" size={size} color={color} />
          ),
        }}
      />

      {/* Déconnexion */}
      <Drawer.Screen
        name="logout"
        options={{
          drawerLabel: 'Déconnexion',
          title: 'Déconnexion',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="log-out" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

// Style personnalisé pour le contenu du Drawer
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
  },
  menuText: {
    marginLeft: 10,
    fontSize: 16,
  },
});