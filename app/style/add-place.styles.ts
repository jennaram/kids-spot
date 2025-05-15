import { StyleSheet } from 'react-native';
import { colorButtonFirst } from './styles';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 20,
  },
  section2: {
    justifyContent: "center",
    flexDirection:'row',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  multilineInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  bottomSpacer: {
    height: 100,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalText: {
    marginTop: 10,
    fontSize: 16,
  },
  
  // Styles améliorés pour le DateTimePicker
  datePicker: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#333',
    alignSelf: 'center', // Centrer horizontalement
    alignItems: 'center',
  },
  datePickerText: {
    color: '#000',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center', // Centrer le texte
  },
  datePickerContainer: {
    width: '100%', // Prend toute la largeur disponible
    alignItems: 'center', // Centre les éléments enfants horizontalement
    marginTop: 8,
    textAlign: 'center',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#333', // Bordure plus foncée
    borderRadius: 8,
    padding: 12,
    marginTop: 8,
    backgroundColor: 'white',
  },
  dateInputText: {
    color: '#000', // Texte noir
    fontSize: 16,
    fontWeight: '500', // Un peu plus prononcé
    textAlign: 'center', // Centrer le texte
  },
  calendarContainer: {
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    overflow: 'hidden',
    marginTop: 8,
    backgroundColor: 'red',
    alignSelf: 'center', // Centrer horizontalement
    width: '100%', // Prendre toute la largeur disponible
    alignItems: 'center', // Centre les éléments enfants horizontalement  
    textAlign: 'center',
  
  },
});