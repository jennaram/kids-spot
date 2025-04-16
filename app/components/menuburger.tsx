import { TouchableOpacity, Image } from 'react-native';
import { useNavigation } from 'expo-router';

export default function MenuBurger() {
  const navigation = useNavigation();
  
  return (
    <TouchableOpacity 
      onPress={() => navigation.toggleDrawer()}
      style={{ marginLeft: 15 }}
    >
      <Image
        source={require("../../assets/images/burger_menu.png")}
        style={{ width: 30, height: 30 }}
      />
    </TouchableOpacity>
  );
}