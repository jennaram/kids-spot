import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from 'expo-router';
import { useDrawerStatus } from '@react-navigation/drawer';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { DrawerActions } from '@react-navigation/native';

export default function MenuBurger() {
  const navigation = useNavigation();
  const drawerStatus = useDrawerStatus();

  return (
    <TouchableOpacity 
      onPress={() => {
        if (drawerStatus === 'closed') {
          navigation.dispatch(DrawerActions.openDrawer());
        } else {
          navigation.dispatch(DrawerActions.closeDrawer());
        }
      }}
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