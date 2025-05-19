import { fontTitle } from "@/app/style/styles";
import { Image, Text, View } from "react-native";

export function Logo() {
    return (
        <View style={{ alignItems:"center" }}>
            <Image
                source={require('../assets/images/Logo.png')}
                style={{ width: 200, height: 200, resizeMode: 'contain', marginBottom: 20 }} /><Text style={[fontTitle]}>
                KIDS SPOT
            </Text>
        </View>
    );
}