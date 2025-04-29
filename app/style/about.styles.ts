// about.styles.ts
import { StyleSheet, Platform } from "react-native";
import { colorButtonFirst, colorButtonThird } from "../style/styles"; // adapte si le chemin diffère

export const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
  },
  outerContainer: {
    flex: 1,
    position: "relative",
  },
  scrollContent: {
    paddingBottom: 60,
  },
  container: {
    padding: 20,
    backgroundColor: colorButtonThird,
  },
  textContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 15,
    marginTop: 10,
    marginBottom: 15,
  },
  description: {
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 8,
    color: "#555",
    textAlign: "center",
  },
  bold: {
    fontWeight: "bold",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    color: colorButtonFirst,
    textAlign: "center",
  },
  bulletPoint: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  bulletText: {
    fontSize: 15,
    lineHeight: 20,
    marginLeft: 10,
    color: "#555",
    flex: 1,
    flexWrap: "wrap",
    maxWidth: "100%",
  },
  buttonContainer: {
    marginBottom: 0,
  },
});
