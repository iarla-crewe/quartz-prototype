import { View, Text } from "react-native";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import HomeButton from "../../components/HomeButton";
import { CardTransactionData } from "../../../model/data/CardTransaction";
import { SOL, USDC } from "../../../model/data/Tokens";
import { theme } from "../Styles";
import { useEffect } from "react";

export default function SpendConfirmedScreen( { route, navigation } : { route: any, navigation: any} ) {
    // TODO - Remove dummy data
    const transactionData = new CardTransactionData({
        amountFiat: 19,
        fiatCurrency: 'EUR',
        amountToken: 20,
        tokenType: USDC,
        timestamp: new Date(),
        vendor: 'Old Oak',
        location: 'Oliver Plunket Street'
    });

    const { transactionHash } = route.params;

    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h1}>Transaction Confirmed</Text>
            </View>

            <DisplayCardTransaction data={transactionData} />

            <View style={theme.standardPadding}>
                <Text style={theme.p} selectable={true} >
                    Signature: {transactionHash}
                </Text>
            </View>

            <HomeButton data={navigation} />
        </View>
    )
}
