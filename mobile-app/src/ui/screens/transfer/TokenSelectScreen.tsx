import { View, Text, TouchableOpacity } from "react-native";
import { SOL, USDC } from '../../../model/data/Tokens'
import { theme } from "../Styles";
import BackButton from "../../components/BackButton";

export default function TokenSelectScreen( { navigation } : {navigation: any} ) {
    return (
        <View>
            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    () => navigation.navigate(
                        'Transfer', 
                        { token: SOL }
                    )
                }
            >
                <Text style={theme.buttonText}>SOL</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    () => navigation.navigate(
                        'Transfer', 
                        { token: USDC }
                    )
                }
            >
                <Text style={theme.buttonText}>USDC</Text>
            </TouchableOpacity>

            <BackButton data={navigation} />
        </View>
    )
}
