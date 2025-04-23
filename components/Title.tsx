import { fontTitle } from "@/app/style/styles"
import { StyleSheet, Text } from "react-native";

type Props = {
    text: string,
}

export function Title({ text }: Props) {
    return (
        <Text style={[styles.title, fontTitle]}>{text}</Text>
    )

}

const styles = StyleSheet.create({
  title: {
    textAlign: 'center',
    color: '#000', // Titre "Votre avis" en noir
  },
});