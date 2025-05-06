
import { StyleSheet, Platform } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    flexDirection: "column",
    alignItems: "flex-start",
    paddingTop: Platform.OS === "ios" ? 2 : 4,
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButtonContainer: {
    width: "100%",
    flexDirection: "row",
    marginBottom: 10,
  },
  backButton: {
    top: 0,
    left: 15,
  },
  titleContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    top: 30,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  content: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  ratingContainer: {
    marginBottom: 30,
    alignItems: "center",
  },
  commentTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#2c3e50",
  },
  textAreaInput: {
    height: 150,
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    marginBottom: 5,
  },
  charCount: {
    alignSelf: "flex-end",
    fontSize: 12,
    color: "#888",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 20,
  },
});