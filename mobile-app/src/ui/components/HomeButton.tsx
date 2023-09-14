import { Text, TouchableOpacity } from "react-native";
import { theme } from "../screens/Styles";

const HomeButton = (props: any) => {
    const navigation = props.data;

    return (
        <TouchableOpacity 
            style = {theme.button}
            onPress={
                () => navigation.reset({
                    index: 0,
                    routes: [{name: 'Home'}],
                })          
            }
        >
            <Text style={theme.buttonText}>Back to Home</Text>
        </TouchableOpacity>
    )
}

export default HomeButton;