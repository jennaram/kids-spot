import { router } from "expo-router";
import { TouchableOpacity, Image, StyleSheet } from "react-native";
import React from "react";

type SwitchButtonProps = {
  type: 'map' | 'liste';
};

export function SwitchButton({ type }: SwitchButtonProps) {
  const handlePress = () => {
    if (type === 'map') {
      router.push('/Location');
    } else {
      router.push('/main');
    }
  };

  const imageSource =
    type === 'map'
      ? require('@/assets/images/switchmap.png')
      : require('@/assets/images/switchlieux.png');

  return (
    <TouchableOpacity onPress={handlePress} style={styles.switchButton}>
      <Image source={imageSource} style={styles.switchIcon} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  switchButton: {
    position: 'absolute',
    bottom: 70,
    right: 15,
    backgroundColor: 'white',
    borderRadius: 25,
    width: 50,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  switchIcon: {
    width: 30,
    height: 30,
  },
});