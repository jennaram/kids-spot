import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { StyleProp, ViewStyle, TextStyle } from 'react-native';
import { colorButtonSecondary } from '../../app/style/styles';

interface AgeBadgesProps {
  tranchesAge?: string[];
  badgeColor?: string;
  containerStyle?: StyleProp<ViewStyle>;
  badgeStyle?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

const AgeBadges: React.FC<AgeBadgesProps> = ({ 
  tranchesAge = [], 
  badgeColor = colorButtonSecondary,
  containerStyle,
  badgeStyle,
  textStyle
}) => {
  return (
    <View style={[styles.ageContainer, containerStyle]}>
      {tranchesAge.map((age, index) => (
        <View key={index} style={[styles.ageBadge, { backgroundColor: badgeColor }, badgeStyle]}>
          <Text style={[styles.ageBadgeText, textStyle]}>{age}</Text>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  ageContainer: {
    flexDirection: "row",
    justifyContent: "center",
    flexWrap: "wrap",
    marginBottom: 25,
    paddingLeft: 15,
  },
  ageBadge: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginHorizontal: 5,
    marginBottom: 10,
  },
  ageBadgeText: {
    color: "white",
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default AgeBadges;