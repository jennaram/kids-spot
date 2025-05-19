import { StyleSheet } from "react-native";
import { colorButtonFirst, colorButtonThird, } from '@/app/style/styles';


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 80,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
    marginBottom: 20,
  },
  submitButton: {
    height: 40,
    width: '50%',
    backgroundColor: colorButtonFirst,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
    marginBottom:20,
  },
  submitButtonText: {
    color: colorButtonThird,
    fontWeight: 'bold',
    fontSize: 16,
  },
  footerContainer: {
    alignItems: 'center',
    padding: 20,
  },
});