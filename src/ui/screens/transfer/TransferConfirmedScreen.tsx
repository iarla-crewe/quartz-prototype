import { StyleSheet, View, Text } from "react-native";
import HomeButton from "../../components/HomeButton";
import { theme } from "../Styles";
import ConfirmationSignature from "../../components/ConfirmationSignature";

export default function TransferConfirmedScreen( { route, navigation } : {route: any, navigation: any} ) {
    const { tokenName, address, amount, transactionHash } = route.params;

    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h1}>Transaction confirmed</Text>
            </View>

            <View style={theme.standardPadding}>
                <View style={{flexDirection: 'row'}}>
                    <Text style={theme.h2b}>
                        {amount} {tokenName}
                    </Text>

                    <Text style={{
                        fontSize: 26,
                        paddingHorizontal: 8
                    }}>
                        sent to  
                    </Text>
                </View>

                <Text style={theme.h2b}>
                    {address}
                </Text>
            </View>

            <View style={theme.standardPadding}>
                <ConfirmationSignature data={transactionHash} />
            </View>

            <HomeButton data={navigation} />
        </View>
    )
}
