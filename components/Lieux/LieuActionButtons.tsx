import React from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

type Props = {
  onCall: () => void;
  onWebsite: () => void;
  onGps: () => void;
  telephone?: string | null;
  siteWeb?: string | null;
};

const LieuActionButtons: React.FC<Props> = ({ onCall, onWebsite, onGps, telephone, siteWeb }) => {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.iconButton}
        onPress={onCall}
        disabled={!telephone}
      >
        <MaterialIcons
          name="phone"
          size={24}
          color={telephone ? "#333" : "#999"}
        />
        <Text style={[styles.iconButtonText, !telephone && styles.disabledText]}>
          Appeler
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onWebsite}
        disabled={!siteWeb}
      >
        <MaterialIcons
          name="language"
          size={24}
          color={siteWeb ? "#333" : "#999"}
        />
        <Text style={[styles.iconButtonText, !siteWeb && styles.disabledText]}>
          Site web
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.iconButton}
        onPress={onGps}
      >
        <MaterialIcons name="place" size={24} color="#333" />
        <Text style={styles.iconButtonText}>Y aller</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginTop: 10,
    },
    iconButton: {
      alignItems: "center",
      justifyContent: "center",
      padding: 10,
      flex: 1,
      marginHorizontal: 10,
    },
    iconButtonText: {
      fontSize: 12,
      color: "#333",
      marginTop: 5,
      textAlign: "center",
    },
    disabledText: {
      color: "#999",
    },
  });
  
export default LieuActionButtons;
