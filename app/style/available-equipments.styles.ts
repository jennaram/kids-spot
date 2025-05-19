import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
    textAlign: 'left',
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
    backgroundColor: '#000',
    borderColor: '#000',
  },
  checkmark: {
    color: '#fff',
    fontSize: 12,
  },
  icon: {
    marginRight: 10,
    color: '#000',
  },
  checkboxLabel: {
    fontSize: 16,
    flex: 1,
  },
});