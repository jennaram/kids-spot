import { TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';

export default function MenuBurger() {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      onPress={() => navigation.toggleDrawer()}
      style={styles.touchable}
    >
      <Image
        source={require("../../assets/images/burger_menu.png")}
        style={styles.image}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  touchable: {
    marginLeft: 15,
    marginTop: 15, // Ajout d'une marge supérieure pour descendre l'image
  },
  image: {
    width: 30,
    height: 30,
    marginTop: 15,
  },
});