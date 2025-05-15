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
// Styles pour le modal des mentions légales
export const modalStyles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 5,
  },
  modalScrollView: {
    maxHeight: "70%",
  },
  legalText: {
    fontSize: 14,
    lineHeight: 20,
    color: "#040101",
  },
  modalFooter: {
    marginTop: 15,
    alignItems: "center",
  },
  closeButtonFooter: {
    backgroundColor: "#D37230",
    paddingVertical: 10,
    paddingHorizontal: 30,
    borderRadius: 12,
  },
  closeButtonText: {
    color: "white",
    fontWeight: "bold",
    borderRadius: 5,
    marginBottom: 0,
  },
});