import React from 'react';
import { TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  onPress: (event: GestureResponderEvent) => void;
};

const ShareButton: React.FC<Props> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.shareButton} onPress={onPress}>
      <MaterialIcons name="share" size={24} color="#333" />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
    shareButton: {
      backgroundColor: "white",
      borderRadius: 20,
      padding: 8,
      elevation: 2,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 1,
    },
  });
  
export default ShareButton;
