import { useRef, useState, useEffect, ComponentProps } from "react";
import { Animated, TouchableOpacity, StyleSheet, Pressable, Modal, View, Dimensions, SafeAreaView } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Item } from "./Item";
import { router } from "expo-router";
import { Logo } from "./Logo";
import { Ionicons } from "@expo/vector-icons";
import { ExitButton } from "./ExitButton";

export function BurgerMenu() {
    type IoniconName = ComponentProps<typeof Ionicons>["name"];
    const [menuWidth, setMenuWidth] = useState(0);
    const [isModalVisible, setModalVisibility] = useState(false);
    const [position, setPosition] = useState<{ top: number, left: number } | null>(null);

    // Animation pour la translation horizontale
    const slideAnim = useRef(new Animated.Value(-400)).current; // Commence en dehors de l'écran à gauche

    const onButtonPress = () => {
        setPosition({
            top: 0,
            left: 0
        });
        setModalVisibility(true);
    };

    const onClose = () => {
        // Ferme avec une animation inverse
        Animated.timing(slideAnim, {
            toValue: -400,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setModalVisibility(false);
        });
    };

    useEffect(() => {
        if (isModalVisible) {
            // Slide-in de gauche à droite
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [isModalVisible]);

    function handleNavigate(link: string): void {
        router.push(link);
        onClose();
    }

    function handleExit(): void {
        console.log("exit?")
        onClose();
    }


    const menuItems: { imageName: IoniconName; text: string; link: string }[] = [
        { imageName: "home", text: "Accueil", link: "/accueil" },
        { imageName: "person", text: "Mon profil", link: "/profil" },
        { imageName: "add-circle", text: "Ajouter un lieu", link: "/add-place" },
        { imageName: "information-circle", text: "À propos", link: "/about" },
        { imageName: "mail", text: "Contact", link: "/contact" },
        { imageName: "code", text: "Page test API", link: "/TestAPI" },
        { imageName: "code", text: "Liste des pages", link: "/indexHold" },
    ];

    return (
        <>
            <Pressable onPress={onButtonPress} style={styles.container}>
                <View
                    style={styles.button}
                >
                    <MaterialIcons
                        name="menu"
                        size={30}
                        color="#000"
                    />
                </View>
            </Pressable>
            <Modal
                animationType="none"
                transparent
                visible={isModalVisible}
                onRequestClose={onClose}
            >
                <Pressable style={styles.backdrop} onPress={onClose} />

                {position && (
                    <Animated.View
                        onLayout={(event) => {
                            const width = event.nativeEvent.layout.width;
                            setMenuWidth(width);
                        }}
                        style={[
                            styles.popup,
                            {
                                top: position.top,
                                left: position.left,
                                transform: [{ translateX: slideAnim }]
                            }
                        ]}
                    >
                        <SafeAreaView style={{ flex: 1 }}>

                            <ExitButton onPress={handleExit} style={{ left: menuWidth + 0 }} />
                            <Logo />

                            <View style={{ flexGrow: 1 }}>
                                {menuItems.map((item, index) => (
                                    <Item
                                        key={index}
                                        imageName={item.imageName}
                                        text={item.text}
                                        link={item.link}
                                        color="#333"
                                        onPress={handleNavigate}
                                    />
                                ))}
                            </View>

                            <Item
                                style={styles.logoutItem}
                                imageName={"log-out"}
                                text={"Déconnexion"}
                                link={"/users/Logout"}
                                color={"#d9534f"}
                                onPress={handleNavigate}
                            />

                        </SafeAreaView>
                    </Animated.View>
                )}
            </Modal>
        </>
    )
}

export const styles = StyleSheet.create({
    container: {
        alignSelf: 'flex-start',
        margin: 15,
    },
    button: {
        margin: 0,
    },
    popup: {
        backgroundColor: "white",
        position: 'absolute',
        padding: 16,
        gap: 16,
        borderTopRightRadius: 12,
        borderBottomRightRadius: 12,
        height: Dimensions.get("window").height,
    },
    backdrop: {
        flex: 1,
        backgroundColor: "rgba(0,0,0, 0.3)"
    },
    logoutItem: {
        borderTopWidth: 1,
        borderTopColor: "#f0f0f0",
        paddingTop: 10,
        marginTop: 10,
    },
    
});