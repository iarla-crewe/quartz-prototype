import { View, Text, TouchableOpacity } from "react-native";
import { SOL, USDC } from '../../../model/data/Tokens'
import { theme } from "../Styles";
import BackButton from "../../components/BackButton";

export default function TransferSelectScreen( { navigation } : {navigation: any} ) {
    return (
        <View>
            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    () => navigation.navigate(
                        'Transfer', 
                        { tokenName: SOL.name }
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
                        { tokenName: USDC.name }
                    )
                }
            >
                <Text style={theme.buttonText}>USDC</Text>
            </TouchableOpacity>

            <BackButton data={navigation} />
        </View>
    )
}
