import { StyleSheet } from 'react-native';
import { colorButtonFirst, colorButtonThird } from './styles';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  scrollView: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'left', 
  },
 
  ageBadgeContainer: {
    margin: 0,
    marginBottom: 0,
  },
  ageBadge: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  ageBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: 'bold',
  },
  ratingContainer: {
    marginBottom: 10,
  },
  ratingGroup: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  multilineInput: {
    height: 100,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
  },
  inputWithIconField: {
    flex: 1,
    padding: 12,
    fontSize: 16,
  },
  iconContainer: {
    padding: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapContainer: {
    height: 200,
    borderRadius: 8,
    overflow: 'hidden',
    marginVertical: 10,
  },
  map: {
    flex: 1,
  },
  markerImage: {
    width: 40, 
    height: 40
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: colorButtonFirst,
    borderColor: colorButtonFirst,
  },
  checkmark: {
    color: colorButtonThird,
    fontSize: 12,
  },
  checkboxLabel: {
    fontSize: 16,
  },
  star: {
    fontSize: 30,
    color: '#ddd',
    marginRight: 10,
  },
  starSelected: {
    color: '#f1c40f',
  },
  bottomSpacer: {
    height: 60,
  },
  // Styles pour le modal de chargement
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)', // Fond semi-transparent
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 30,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
  },
});

export default styles;