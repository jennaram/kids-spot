import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useRouter } from 'expo-router';
import { colorButtonFirst, colorButtonThird, fontTitle } from './style/styles';
import { AppLogo } from './components/AppLogo';

export default function Index() {
  const router = useRouter();

  // Style inline identique pour les 3 boutons
  const buttonStyle = {
    height: 40,
    width: '50%',
    backgroundColor: colorButtonFirst,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30
  };

  const buttonTextStyle = {
    color: colorButtonThird,
    fontWeight: 'bold',
    fontSize: 16
  };

  return (
    <View style={styles.container}>
      {/* Partie haute avec logo et texte */}
      <View style={styles.topSection}>
        <AppLogo size={200} style={styles.logo} />
        <Text style={[fontTitle, styles.title]}>KIDS SPOT</Text>

        <TouchableOpacity 
          style={buttonStyle}
          onPress={() => router.push('/login')}
        >
          <Text style={buttonTextStyle}>Se Connecter</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={buttonStyle}
          onPress={() => router.push('/about')}
        >
          <Text style={buttonTextStyle}>À propos</Text>
        </TouchableOpacity>
      </View>

      {/* Bouton Mode invité en bas */}
      <View style={styles.bottomSection}>
        <TouchableOpacity 
          style={buttonStyle}
          onPress={() => router.push('/main')}
        >
          <Text style={buttonTextStyle}>Mode invité</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  topSection: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  bottomSection: {
    padding: 20,
    alignItems: 'center',
  },
  logo: {
    marginBottom: 20,
  },
  title: {
    marginBottom: 20,
  },
});