import { View, Text } from "react-native";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import HomeButton from "../../components/HomeButton";
import { CardTransactionData } from "../../../model/data/CardTransaction";
import { SOL, USDC } from "../../../model/data/Tokens";
import { theme } from "../Styles";

export default function SpendAcceptedScreen( { navigation } : { navigation: any} ) {
    // TODO - Remove dummy data
    const transactionData = new CardTransactionData({
        amountFiat: 1050,
        fiatCurrency: 'EUR',
        amountToken: 1000000000,
        tokenType: SOL,
        timestamp: new Date(),
        vendor: 'Old Oak',
        location: 'Oliver Plunket Street'
    });

    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h1}>Transaction Approved</Text>
            </View>

            <DisplayCardTransaction data={transactionData} />

            <HomeButton data={navigation} />
        </View>
    )
}
