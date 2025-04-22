import { StyleSheet } from "react-native";
import { fontTitle } from "../style/styles";

export const drawerStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "space-between",
    paddingBottom: 20,
  },
  menuSection: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  activeItem: {
    backgroundColor: "#f0f7ff",
    borderRightWidth: 3,
    borderRightColor: "#2563eb",
  },
  menuText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#333",
  },
  logoutItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    marginHorizontal: 10,
  },
  logoutText: {
    fontSize: 16,
    marginLeft: 15,
    color: "#d9534f",
    fontWeight: "500",
  },
  logoImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  fontTitle, // Réutilisation du style importé
});