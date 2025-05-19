import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'left', // Centrer le label
  },
  ratingContainer: {
    flexDirection: 'row',
    justifyContent: 'center', // Conteneur principal centré
    width: '100%',
  },
  ratingGroup: {
    flexDirection: 'row',
    justifyContent: 'center', // Groupe d'étoiles centré
  },
  star: {
    fontSize: 30,
    color: '#ddd',
    marginHorizontal: 5, // Changé de marginRight à marginHorizontal pour un espacement égal
  },
  starSelected: {
    color: '#f1c40f',
  },
});

export default styles;