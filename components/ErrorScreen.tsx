import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router'; // Si tu utilises expo-router
import { Logo } from './BurgerMenu/Logo';

export default function ErrorScreen({ message = "Oups... une erreur est survenue." }) {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Logo/>
      <Text style={styles.emoji}>😔</Text>
      <Text style={styles.message}>{message}</Text>
      <Text>Nos lutins numériques sont en pleine discussion avec les serveurs. Apparemment, ils ne sont pas d'accord sur quelque chose. On essaie de calmer le jeu...</Text>
      
      <TouchableOpacity style={styles.button} onPress={() => router.back()}>
        <Text style={styles.buttonText}>Retour</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  emoji: {
    fontSize: 64,
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 30,
    color: '#333',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});