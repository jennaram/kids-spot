
import { StyleSheet } from 'react-native';
import { colorButtonFirst, colorButtonThird } from './styles';

export const FavoriteStyles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  // container: {
  //   flex: 1,
  //   backgroundColor: colorButtonThird,
  // },
  // searchRow: {
  //   flexDirection: 'row',
  //   padding: 12,
  //   gap: 8,
  // },
  // searchInput: {
  //   flex: 1,
  //   padding: 10,
  //   backgroundColor: '#f0f0f0',
  //   borderRadius: 8,
  // },
  // equipButton: {
  //   paddingHorizontal: 12,
  //   justifyContent: 'center',
  //   backgroundColor: colorButtonSecondary,
  //   borderRadius: 8,
  // },
  // filterRow: {
  //   flexDirection: 'row',
  //   justifyContent: 'space-around',
  //   marginBottom: 8,
  //   paddingHorizontal: 8,
  // },
  // filterButton: {
  //   paddingVertical: 6,
  //   paddingHorizontal: 12,
  //   backgroundColor: colorButtonThird,
  //   borderRadius: 20,
  //   borderWidth: 1,
  //   borderColor: colorButtonFirst,
  // },
  // filterButtonActive: {
  //   backgroundColor: colorButtonFirst,
  // },
  // filterText: {
  //   color: '#000',
  // },
  // filterTextActive: {
  //   color: colorButtonThird,
  // },
  favoriCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  favoriImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  favoriDetails: {
    flex: 1,
    marginLeft: 15,
  },
  favoriName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  favoriDescription: {
    fontSize: 14,
    color: '#666',
    marginTop: 5,
  },
  removeButton: {
    marginTop: 10,
    backgroundColor: colorButtonFirst,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  removeButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  noFavorisText: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 20,
  },
  trashIconContainer: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 20,
    elevation: 2,
  },
  backButton:{
    top: 0,
    left: 15,
  },
  image: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 10,
    backgroundColor: '#ddd',
},
});
export default FavoriteStyles;