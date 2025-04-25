import { StyleSheet } from "react-native";
import { colorButtonFirst, colorButtonThird } from "../../app/style/styles";


const styles = StyleSheet.create({
  rowButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  safeArea: {
    flex: 1,
    backgroundColor: colorButtonThird,
},
  mainContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  loadingContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
 
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8d7da",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  retryButton: {
    backgroundColor: colorButtonFirst,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: "center",
    marginTop: 20,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    fontSize: 16,
    color: "#721c24",
    textAlign: "center",
    marginTop: 10,
  },
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "white",
  },
  imageContainer: {
    width: "100%",
    marginTop: 10,
    padding: 15,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "white",
    position: "relative",
  },
  headerImage: {
    width: "100%",
    height: 250,
    borderRadius: 15,
  },
  centeredContent: {
    alignItems: "center",
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  ratingShareContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: 10,
    marginTop: 15,
    marginBottom: 10,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  nom: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  note: {
    fontSize: 18,
    color: colorButtonFirst,
    fontWeight: "bold",
    marginRight: 5,
  },
  starIcon: {
    marginRight: 5,
  },
  avis: {
    fontSize: 16,
    color: "#333",
  },
 
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  horairesContainer: {
    marginBottom: 20,
  },
  horaires: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    textAlign: "center",
  },
  
  actionsContainer: {
    width: "100%",
    maxWidth: 400,
    marginTop: 20,
  },
 
  
  ratingWrapper: {
    flex: 1,
    alignItems: "center",
  },
});

export default styles;