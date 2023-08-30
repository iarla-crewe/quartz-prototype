import { Text, TouchableOpacity } from "react-native";
import { theme } from "../screens/Styles";

const BackButton = (props: any) => {
    const navigation = props.data;

    return (
        <TouchableOpacity 
            style = {theme.button}
            onPress={
                () => navigation.goBack()
            }
        >
            <Text style={theme.buttonText}>Back</Text>
        </TouchableOpacity>
    )
}

export default BackButton;