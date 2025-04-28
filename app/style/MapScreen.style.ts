import { Platform, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  menuContainer: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 30,
    left: 20,
    zIndex: 100,
  },
  userMarker: {
    width: 40,
    height: 40,
  },
  cultureMarker: {
    width: 40,
    height: 40,
    backgroundColor: '#ff9770',
    borderRadius: 25,
    elevation: 10,
  },
  foodMarker: {
    width: 40,
    height: 40,
    backgroundColor: '#95d5b2',
    borderRadius: 25,
    elevation: 10,
  },
  loisirsMarker: {
    width: 40,
    height: 40,
    backgroundColor: '#8ecae6',
    borderRadius: 25,
    elevation: 10,
  },
  switchButton: {
    position: 'absolute',
    bottom: 100,
    right: 20,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default styles;
