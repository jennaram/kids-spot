import { StyleSheet } from 'react-native';
import {
  colorButtonFirst,
  colorButtonThird,
} from '@/app/style/styles';

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 40,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 30,
  },
  formContainer: {
    width: '100%',
    backgroundColor: 'white',
    padding: 20,
  },
  label: {
    fontSize: 14,
    color: 'black',
    marginBottom: 5,
    fontWeight: '500',
  },
  submitButton: {
    height: 50,
    backgroundColor: colorButtonFirst,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  submitButtonText: {
    color: colorButtonThird,
    fontSize: 16,
    fontWeight: '600',
  },
  ageContainerStyle: {
    marginBottom: 25,
  },
  ageBadgeStyle: {
    backgroundColor: '#007BFF',
  },
  ageBadgeTextStyle: {
    color: 'white',
  },
  inputGroup: {
    marginBottom: 15,
  },
});
