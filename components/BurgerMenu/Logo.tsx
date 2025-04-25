import { fontTitle } from "@/app/style/styles";
import { View, Image, StyleSheet, Text } from "react-native";

export function Logo(){
    return <View
              style={[
                styles.header,
                {
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "flex-start", // Aligne les éléments sur la gauche
                },
              ]}
            >
              <Image
                source={require("../../assets/images/Logo.png")}
                style={styles.logoImage}
              />
              <Text style={[fontTitle, { marginLeft: 10 }]}>Kids Spot</Text>
            </View>
}

export const styles = StyleSheet.create({
    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: "#f0f0f0",
      },
      logoImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
      },
});