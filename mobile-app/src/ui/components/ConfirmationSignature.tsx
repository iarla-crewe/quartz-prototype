import { Text, TouchableOpacity, View } from "react-native";
import { theme } from "../Styles";

const ConfirmationSignature = (props: any) => {
    const signature = props.data;

    return (
        <View>
            <Text style={theme.p} >
                Signature:
            </Text>
            <Text style={theme.p} selectable={true} >
                {signature}
            </Text>
        </View>
    )
}

export default ConfirmationSignature;