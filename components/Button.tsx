import { TouchableOpacity } from "react-native";
import Icon from 'react-native-vector-icons/Feather';

type Button = {
    imageName: string;
    onPress: () => void;
};



export function Button({ imageName, onPress }: Button) {
    return (
        <TouchableOpacity onPress={onPress}>
            <Icon name="trash-2" size={20}/>
        </TouchableOpacity>
    );
}