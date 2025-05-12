import React from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { colorButtonFirst } from 'app/style/styles';

// Récupérer la largeur de l'écran
const { width: SCREEN_WIDTH } = Dimensions.get('window');

interface SelectionBadgesProps {
  options: string[];
  selectedOptions: string[];
  onToggle: (option: string) => void;
  label?: string;
  activeColor?: string;
  inactiveColor?: string;
  multiSelect?: boolean;
}

const SelectionBadges: React.FC<SelectionBadgesProps> = ({
  options,
  selectedOptions,
  onToggle,
  label,
  activeColor = colorButtonFirst,
  inactiveColor = '#ddd',
  multiSelect = false
}) => {
  const getTranslatedLabel = (key: string) => {
    const translations: { [key: string]: string } = {
      '0-2': '0-2 ans',
      '3-6': '3-6 ans',
      '7+': '7 ans et plus',
      'restaurant': 'Restaurant',
      'culture': 'Culture',
      'leisure': 'Loisirs'
    };
    return translations[key] || key;
  };

  const handleToggle = (option: string) => {
    if (multiSelect) {
      // Logique de sélection multiple
      onToggle(option);
    } else {
      // Logique de sélection unique
      onToggle(option);
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={styles.badgesContainer}>
        {options.map((option) => (
          <TouchableOpacity
            key={option}
            onPress={() => handleToggle(option)}
            style={[
              styles.badgeWrapper,
              { 
                width: (SCREEN_WIDTH - 60) / options.length, // Répartition égale
                maxWidth: 150 // Limite de largeur maximale
              }
            ]}
          >
            <View 
              style={[
                styles.badge, 
                { 
                  backgroundColor: selectedOptions.includes(option) 
                    ? activeColor 
                    : inactiveColor 
                }
              ]}
            >
              <Text 
                style={[
                  styles.badgeText,
                  { 
                    fontSize: options.length > 3 ? 12 : 14 // Ajustement de la taille de police
                  }
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {getTranslatedLabel(option)}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
    paddingHorizontal: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  badgesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badgeWrapper: {
    marginRight: 5,
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    height: 45, // Hauteur fixe pour uniformité
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default SelectionBadges;