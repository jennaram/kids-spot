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
    position: 'relative', // Pour permettre le positionnement absolu de l'icône
  },
  headerContainer: {
    position: 'relative', // Pour le positionnement des éléments à l'intérieur
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 10, // Espace en haut pour l'icône
  },
  popupIcon: {
    position: 'absolute',
    top: -30,
    left: 0, // Modifiez cette ligne
    width: 40,
    height: 40,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 10,
  },
  popupTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    width: '80%', // Évite que le titre n'aille jusqu'à l'icône
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