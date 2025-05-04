import { View, StyleSheet } from "react-native";
import { Button } from "@/components/NavBar/Button";
import { useRoute } from "@react-navigation/native";
import { useEffect } from "react";

export function Navigation() {
    const route = useRoute();

    useEffect(() => {
        console.log('Nom de la page actuelle :', route.name);
    }, [route]);
    

    const links = [
        { imageName: "map-outline", link: "Main" },
        { imageName: "calendar-outline", link: "Evenement" },
        { imageName: "add-circle-outline", link: "add-place" },
        { imageName: "heart-outline", link: "favoris" },
    ];

    return (

        <View style={styles.container}>
            {links.map(({ imageName, link }, index) => (
                <Button
                    key={index}
                    imageName={imageName}
                    link={`/${link.toLowerCase()}`} 
                    active={
                        route.name.toLowerCase() === link.toLowerCase() ||
                        (link.toLowerCase() === 'main' && route.name.toLowerCase() === 'places')
                    }
                />
            ))}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        flexDirection: 'row',
        backgroundColor: '#2D5E3D',
        height: 70,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingBottom:15,
        width: '100%',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
});