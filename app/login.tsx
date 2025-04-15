import { Image, Text, View, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from 'expo-router';

export default function LoginPage() {
  const router = useRouter();
  
  const handleGoogleLogin = async () => {
    // Implémentez votre logique de connexion Google ici
    console.log("Connexion Google");
    // Exemple avec Firebase:
    // try {
    //   await GoogleSignin.signIn();
    //   router.push('/main');
    // } catch (error) {
    //   console.error(error);
    // }
  };

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require('../assets/images/Logo.png')}
        style={styles.logo}
      />
      
      {/* Formulaire de connexion */}
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Adresse mail"
          keyboardType="email-address"
          autoCapitalize="none"
        />
        
        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          secureTextEntry={true}
        />
        
        <TouchableOpacity 
          style={styles.loginButton}
          onPress={() => router.push('/main')}
        >
          <Text style={styles.loginButtonText}>Connexion</Text>
        </TouchableOpacity>
        
        <TouchableOpacity onPress={() => router.push('/password-reset')}>
          <Text style={styles.forgotPassword}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        {/* Séparateur */}
        <View style={styles.separator}>
          <View style={styles.separatorLine} />
          <Text style={styles.separatorText}>ou</Text>
          <View style={styles.separatorLine} />
        </View>

        {/* Bouton Google */}
        <TouchableOpacity 
          style={styles.googleButton}
          onPress={handleGoogleLogin}
        >
          <Image
            source={require('../assets/images/google-icon.png')}
            style={styles.googleIcon}
          />
          <Text style={styles.googleButtonText}>Continuer avec Google</Text>
        </TouchableOpacity>
      </View>
      
      {/* Lien vers l'inscription */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Pas encore de compte ? </Text>
        <TouchableOpacity onPress={() => router.push('/registration')}>
          <Text style={styles.signupLink}>Inscrivez-vous !</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 40,
  },
  formContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 30,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
  },
  loginButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#D37230',
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    marginBottom: 15,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  forgotPassword: {
    color: '#666',
    fontSize: 14,
    textDecorationLine: 'underline',
    marginBottom: 20,
  },
  separator: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginVertical: 15,
  },
  separatorLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ddd',
  },
  separatorText: {
    marginHorizontal: 10,
    color: '#666',
    fontSize: 14,
  },
  googleButton: {
    width: '100%',
    height: 50,
    backgroundColor: '#fff',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  googleIcon: {
    width: 24,
    height: 24,
    marginRight: 12,
  },
  googleButtonText: {
    color: '#333',
    fontSize: 16,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 20,
  },
  signupText: {
    color: '#333',
    fontSize: 16,
  },
  signupLink: {
    color: '#D37230',
    fontSize: 16,
    fontWeight: 'bold',
    textDecorationLine: 'underline',
  },
});