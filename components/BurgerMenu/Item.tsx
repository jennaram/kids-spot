import { fontTitle } from "@/app/style/styles";
import { Ionicons } from "@expo/vector-icons"
import { ComponentProps } from "react";
import { ColorValue, View, Text, StyleSheet, Pressable, ViewStyle, StyleProp } from "react-native"

type IoniconName = ComponentProps<typeof Ionicons>["name"];

type Props = {
    imageName: IoniconName,
    text: string,
    link: string,
    color: ColorValue,
    onPress: (link: string) => void;
    style?: StyleProp<ViewStyle>
}

export function Item({ imageName, text, link, color, onPress, style }: Props) {
    return (
        <Pressable onPress={() => onPress(link)}>
            <View style={[styles.item, style]}>
                <Ionicons
                    name={imageName}
                    size={26}
                    color={color ? color : '#E0E0E0'}
                />
                <Text style={[styles.text, {color: color? color : '#E0E0E0'}]}>{text}</Text>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    item: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 16,
        marginLeft: 15
    },

    fontTitle, // Réutilisation du style importé
});