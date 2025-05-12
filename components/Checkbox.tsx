import { TouchableOpacity, View } from "react-native";
import { StyleSheet, Text, Image } from "react-native";
import { colorButtonFirst } from "@/app/style/styles";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  icon?: any; // Replace 'any' with a specific type if you know the type of 'icon'
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onToggle, icon }) => {
    return (
      <View style={checkboxStyles.container}>
        <TouchableOpacity 
          style={[checkboxStyles.checkbox, checked && checkboxStyles.checked]} 
          onPress={onToggle}
        >
          {checked && <Text style={checkboxStyles.checkmark}>✓</Text>}
        </TouchableOpacity>
        {icon && (
          <Image source={icon} style={checkboxStyles.icon} />
        )}
        <Text style={checkboxStyles.label}>{label}</Text>
      </View>
    );
  };
  
  // Styles pour le composant Checkbox
  const checkboxStyles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      marginVertical: 12,
    },
    checkbox: {
      height: 24,
      width: 24,
      borderRadius: 4,
      borderWidth: 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    checked: {
      backgroundColor: 'white',
    },
    checkmark: {
      color: 'black',
      fontSize: 16,
    },
    label: {
      marginLeft: 10,
      fontSize: 16,
    },
    icon: {
      width: 24,
      height: 24,
      marginLeft: 10,
      marginRight: 5,
    },
  });
export default Checkbox;