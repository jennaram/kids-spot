import { TouchableOpacity, View, StyleSheet, Alert } from "react-native";
import Icon from 'react-native-vector-icons/Feather';

type Button = {
    onPressDel: () => void;
    onPressEdit: () => void;
};


const handleDelete = (onDelete: () => void) => {
    Alert.alert(
        'Confirmation',
        'Êtes-vous sûr de vouloir supprimer ce lieu ?',
        [
            {
                text: 'Non',
            },
            {
                text: 'Oui',
                onPress: onDelete,
            },
        ],
        { cancelable: false }
    );
}


export function ButtonAdmin({ onPressDel, onPressEdit }: Button) {
    return (

        <View style={styles.deleteButtonContainer}>
            <View style={styles.buttonWrapper}>
                <TouchableOpacity onPress={onPressEdit}>
                    <Icon name="edit-2" size={20} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDelete(onPressDel)}  style={{ marginHorizontal: 15 }}>
                    <Icon name="trash-2" size={20} />
                </TouchableOpacity>
            </View>
        </View>




    );


}

const styles = StyleSheet.create({
    deleteButtonContainer: {
        position: 'absolute',
        right: 10,

    },
    buttonWrapper: {
        flexDirection: 'row',
    },
});