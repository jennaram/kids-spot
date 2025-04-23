import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

export default function MenuBurger() {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      onPress={() => navigation.toggleDrawer()}
      style={styles.touchable}
    >
      <MaterialIcons 
        name="menu" // Icône représentant un menu burger
        size={30} // Taille de l'icône
        color="#000" // Couleur de l'icône (noir par défaut)
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginLeft: 15,
    marginTop: 15, // Ajout d'une marge supérieure pour descendre l'icône
  },
});