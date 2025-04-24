import { StyleSheet, Dimensions } from 'react-native';
import { colorButtonFirst, colorButtonSecondary, colorButtonThird } from './styles';

// Obtenir la largeur de l'écran pour calculer les dimensions
const { width } = Dimensions.get('window');
const cardWidth = width * 0.92; // La carte prend 92% de la largeur de l'écran

export const eventCardStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  headerBar: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex:1,
    paddingVertical: 20,
    paddingBottom: 90, // Espace pour la barre de navigation
  },
  cardContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 24,
  },
  card: {
    width: cardWidth,
    height: cardWidth * 0.8, 
    borderRadius: 16,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    backfaceVisibility: 'hidden',
  },
  cardBack: {
    backgroundColor: '#f8f9fa',
  },
  cardContent: {
    flex: 1,
    flexDirection: 'column',
  },
  image: {
    width: '100%',
    height: '70%', // L'image prend 70% de la hauteur de la carte
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end', // Aligne les éléments en bas
    padding: 16,
    backgroundColor: '#fff',
  },
  textContainer: {
    flex: 1,
  },
  location: {
    fontSize: 14,
    fontWeight: '600',
    color: '#222',
    marginBottom: 4,
  },
  subtitle2: {
    fontSize: 16,
    color: '#222',
    marginBottom: 3,
    marginTop: 3,
  },
  date: {
    fontSize: 14,
    color: '#717171',
  },
  infoButton: {
    backgroundColor: colorButtonFirst,
    alignSelf: 'flex-end',
  },
  infoText: {
    color: '#fff',
    fontSize: 14,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '100',
    margin: 20,
  },
  modalText: {
    fontSize: 16,
    marginHorizontal: 20,
    marginBottom: 10,
    lineHeight: 22,
  },
  boutonRetour: {
    position: 'absolute',
    top: 240,               // distance depuis le haut
    right: 20,             // distance depuis la droite
    backgroundColor: colorButtonFirst,
  },
  readMoreButton: {
    alignSelf: 'flex-start',
    marginTop: 0,
    marginBottom: 0,
  },
  readMoreText: {
    color: colorButtonSecondary,
    fontWeight: '500',
    marginStart: 15,
  },
  
  // Styles pour la modal de description complète
  modalContainer: {
    flex: 1,
    backgroundColor: 'white',
  },
  modalHeader: {
    backgroundColor: '#ffffff',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  modalHeaderTitle: {
    color: 'black',
    flex: 1,
  },
  closeButton: {
    borderColor: colorButtonFirst,
    borderRadius: 8,
    padding: 8,
    backgroundColor: colorButtonFirst,
  },
  modalBody: {
    flex: 1,
    padding: 20,
  },
  fullDescriptionText: {
    fontSize: 16,
    lineHeight: 24,
  },
  descriptionContainer: {
    marginVertical: 5,
  },
});