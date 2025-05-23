import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { fontTitle } from './style/styles';
import { styles } from '@/app/style/accueil.styles';
import { useAuth } from "@/context/auth";



export default function Index() {
  const router = useRouter();
  const { pseudo, grade } = useAuth();
  const handleConnexion = () => {
    // Rediriger vers la page de connexion
    router.push('/users/login');
  };

  const handleAPropos = () => {
    // Rediriger vers la page à propos
    router.push('/about');
  };

  const handleModeInvite = () => {
    // Rediriger vers la carte en mode invité
    router.push('/main');
    console.log("la carte")
  };

  return (
    <View style={{ flex: 1, backgroundColor: 'white' }}>
      {/* Partie haute avec logo et texte */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 80 }}>
        <Image
          source={require('../assets/images/Logo.png')}
          style={{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 20 }}
        />
        <Text style={[fontTitle]}>
          KIDS SPOT
        </Text>

        {/* Boutons Connexion et À propos */}
        {!pseudo ? (
          <TouchableOpacity style={styles.submitButton} onPress={handleConnexion}>
            <Text style={styles.submitButtonText}>Se Connecter</Text>
          </TouchableOpacity>
        ) : (null)}
        <TouchableOpacity style={styles.submitButton} onPress={handleAPropos}>
          <Text style={styles.submitButtonText}>À propos</Text>
        </TouchableOpacity>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <Text style={{ textAlign: 'center' }}>Bonjour {pseudo}</Text>
        </View>

      </View>
      {/* Bouton Mode invité en bas */}
      <View style={{ alignItems: 'center', padding: 20 }}>
        <TouchableOpacity style={styles.submitButton} onPress={handleModeInvite}>
          <Text style={styles.submitButtonText}>{pseudo ? "Allons y" : "Mode invité"}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}


