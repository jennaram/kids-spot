import React from "react";
import { View, Text, StyleSheet, Image, Switch } from "react-native";

interface CheckSwitchProps {
  label: string;
  checked: boolean;
  onToggle: () => void;
  icon?: any; // Remplace 'any' par ImageSourcePropType si tu veux typer précisément
}

const CheckSwitch: React.FC<CheckSwitchProps> = ({ label, checked, onToggle, icon }) => {
  return (
    <View style={styles.container}>
      {icon && <Image source={icon} style={styles.icon} />}
      <Text style={styles.label}>{label}</Text>
      <Switch style={ styles.switch }
        value={checked}
        onValueChange={onToggle}
        trackColor={{ false: "#ccc", true: "#4cd137" }}
        thumbColor={checked ? "#fff" : "#f4f3f4"}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 12,
    justifyContent: "space-between",
  },
  label: {
    flex: 1,
    fontSize: 16,
  },
  icon: {
    width: 24,
    height: 24,
    marginRight: 10,
  },
    switch: {
     marginLeft: 5,
    },
});

export default CheckSwitch;
