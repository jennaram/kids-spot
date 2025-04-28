import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  backdropTouchable: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 30,
    paddingTop: 16,
    maxHeight: '40%',
  },
  handle: {
    width: 40,
    height: 5,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 16,
    alignSelf: 'center',
  },
  content: {
    paddingVertical: 10,
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    justifyContent: 'center', // Centre l'ensemble du contenu dans le header
  },
  iconTitleContainer: {
    flexDirection: 'row',   // Aligne l'icône et le titre sur la même ligne
    justifyContent: 'center', // Centre l'icône et le titre
    alignItems: 'center',   // Centre verticalement l'icône et le titre
  },
  popupIcon: {
    width: 40,
    height: 40,
    borderRadius: 25, // Cercle autour de l'icône
    justifyContent: 'center', // Centre l'icône dans le cercle
    alignItems: 'center', // Centre l'icône dans le cercle
    elevation: 10, // Ajoute de l'ombre pour l'effet de profondeur
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  cultureBackground: {
    backgroundColor: '#ff9770', // Culture : couleur orange
  },
  restaurantBackground: {
    backgroundColor: '#95d5b2', // Restaurant : couleur verte
  },
  loisirBackground: {
    backgroundColor: '#8ecae6', // Loisir : couleur bleu clair
  },
  infoContainer: {
    marginBottom: 15,
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 5,
    textAlign: 'center',
  },
  detailsButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  detailsButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: '600',
  },
  arrowRight: {
    fontSize: 16,
    color: '#000',
    marginLeft: 5,
  }
});

export default styles;
