import { Image, Text, View, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

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
    <View style={{ flex: 1 }}>
      {/* Partie haute avec logo et texte */}
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start', paddingTop: 80 }}>
        <Image
          source={require('../assets/images/Logo.png')}
          style={{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 20 }}
        />
        <Text style={{ color: '#28603E', fontWeight: 'bold', fontSize: 24 }}>
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
    backgroundColor: '#D37230', //orange
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
