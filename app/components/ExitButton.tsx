import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';

import { GestureResponderEvent, StyleProp, ViewStyle } from 'react-native';

interface ExitButtonProps {
  onPress: (event: GestureResponderEvent) => void;
  style?: StyleProp<ViewStyle>;
}

const ExitButton: React.FC<ExitButtonProps> = ({ onPress, style }) => {
  return (
    <Pressable 
      style={[styles.closeButton, style]} 
      onPress={onPress}
    >
      <Text style={styles.closeButtonText}>×</Text>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    padding: 10,
    backgroundColor: 'red',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 30,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
    lineHeight: 30,
    marginTop: -2, // Ajustement pour centrer visuellement le texte
  },
});

export default ExitButton;