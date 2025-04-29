// contact.styles.ts
import { StyleSheet } from 'react-native';
import { colorButtonThird, colorFourth, } from "../style/styles";

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  container: {
    flexGrow: 1,
    padding: 20,
    paddingBottom: 100, // Pour éviter que la navbar masque le contenu
    backgroundColor: colorButtonThird,
  },
  content: {
    marginTop: 20,
  },
  member: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 15,
    padding: 15,
    backgroundColor: colorFourth,
    borderRadius: 10,
  },
  name: {
    fontSize: 16,
    flex: 1,
  },
  iconsContainer: {
    flexDirection: "row",
    gap: 8,
  },
  iconButton: {
    padding: 8,
  },
  icon: {
    marginHorizontal: 5,
  },
});