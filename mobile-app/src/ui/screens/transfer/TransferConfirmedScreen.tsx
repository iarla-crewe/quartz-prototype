import { StyleSheet, View, Text } from "react-native";
import HomeButton from "../../components/HomeButton";
import { theme } from "../Styles";
import ConfirmationSignature from "../../components/ConfirmationSignature";

export default function TransferConfirmedScreen( { route, navigation } : {route: any, navigation: any} ) {
    const { tokenName, address, amount, transactionHash } = route.params;

    return (
        <View style={theme.mainContainer}>
            <View style={theme.centeredView}>
                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>Transaction Confirmed</Text>
                </View>

                <View style={theme.standardPadding}>
                    <View style={{flexDirection: 'row'}}>
                        <Text style={theme.h2b}>
                            {amount} {tokenName}
                        </Text>

                        <View style={{paddingHorizontal: 8}}>
                            <Text style={theme.p}>
                                sent to
                            </Text>
                        </View>
                    </View>

                    <Text style={theme.h2b}>
                        {address}
                    </Text>
                </View>

                <View style={theme.standardPadding}>
                    <ConfirmationSignature data={transactionHash} />
                </View>
            </View>
        </View>
    )
}
