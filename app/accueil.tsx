import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { colorButtonFirst, colorButtonSecondary, colorButtonThird, colorFourth, fontSubtitle } from './style/styles';
import { fontTitle, loadFonts } from './style/styles';

const Stack = createNativeStackNavigator();

export default function Index() {
  const router = useRouter();

  const handleConnexion = () => {
    // Rediriger vers la page de connexion
    router.push('/login');
  };

  const handleAPropos = () => {
    // Rediriger vers la page à propos
    router.push('/about');
  };

  const handleModeInvite = () => {
    // Rediriger vers la carte en mode invité
    router.push('/main');
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
        <TouchableOpacity style={styles.submitButton} onPress={handleConnexion}>
          <Text style={styles.submitButtonText}>Se Connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.submitButton} onPress={handleAPropos}>
          <Text style={styles.submitButtonText}>À propos</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Mode invité en bas */}
      <View style={{ alignItems: 'center', padding: 20 }}>
        <TouchableOpacity style={styles.submitButton} onPress={handleModeInvite}>
          <Text style={styles.submitButtonText}>Mode invité</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({

  
  submitButton: {
    height: 40,
    width: '50%',
    backgroundColor: colorButtonFirst,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: colorButtonThird,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
