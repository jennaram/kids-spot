import { StyleSheet } from 'react-native';
import { colorButtonFirst } from '@/app/style/styles';

export default StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  checkbox: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    
  },
  checkboxBox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
  },
  checkboxSelected: {
    backgroundColor: colorButtonFirst,
    borderColor: colorButtonFirst,
  },
  checkmark: {
    color: '#fff',
    fontWeight: 'bold',
  },
  checkboxLabel: {
    fontSize: 14,
  },
});
