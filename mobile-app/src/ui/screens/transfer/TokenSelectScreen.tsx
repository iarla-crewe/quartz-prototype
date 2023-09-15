import { View, Text, TouchableOpacity, Image } from "react-native";
import { SOL, USDC } from '../../../model/data/Tokens'
import { theme } from "../Styles";
import BackButton from "../../components/BackButton";

export default function TokenSelectScreen( { navigation } : {navigation: any} ) {
    return (
        <View style={theme.mainContainer}>
            <View style={theme.centeredView}>
                <View style={{flexDirection: "row"}}>
                    <TouchableOpacity 
                        style={theme.standardPadding}
                        onPress={
                            () => navigation.navigate(
                                'Transfer', 
                                { token: SOL }
                            )
                        }
                    >
                        <Image source={require("../../../../assets/sol.png")} style={theme.tokenIconBig} />
                    </TouchableOpacity>

                    <TouchableOpacity 
                        style={theme.standardPadding}
                        onPress={
                            () => navigation.navigate(
                                'Transfer', 
                                { token: USDC }
                            )
                        }
                    >
                        <Image source={require("../../../../assets/usdc.png")} style={theme.tokenIconBig} />
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    )
}
