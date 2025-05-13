import { StyleSheet, Dimensions } from 'react-native';
import { colorButtonFirst, colorButtonThird } from './styles';

const { width } = Dimensions.get('window');

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
  ageBadgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
  },
  ageBadgeContainer: {
    margin: 0,
    marginBottom: 0,
  },
  ageBadge: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    backgroundColor: colorButtonFirst,
    minWidth: width / 3.2,
    maxWidth: width / 2,
    alignItems: 'center',
    marginBottom: 10,
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
    height: 40,
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

  // FiltreButtons styles
  filtreButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
    gap: 10,
    marginBottom: 20,
  },
  filtreButton: {
    backgroundColor: colorButtonFirst,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    minWidth: width / 3.2,
    maxWidth: width / 2,
    alignItems: 'center',
    marginBottom: 10,
  },
  filtreButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
});

export default styles;
