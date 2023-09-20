import { StyleSheet, Text, View } from "react-native";
import { CardTransactionData } from "../../model/data/CardTransaction";
import { currencyToString } from "../../utils";
import { theme } from "../screens/Styles";


const DisplayCardTransaction = (props: any) => {
    const transactionData = props.data;

    //add back if transactionData.amountToken is stored as raw amount instead of ui amount
    // const fiatDisplay = currencyToString(transactionData.amountFiat, 2);
    // const tokenDisplay = currencyToString(transactionData.amountToken, transactionData.tokenType.decimals);

    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h3}>
                    {transactionData.amountToken} {transactionData.tokenType.name} {'('}{transactionData.amountFiat} {transactionData.fiatCurrency}{')'}
                </Text>
                <Text style={theme.p}>
                    {transactionData.vendor}, {transactionData.location}
                </Text>
            </View>

            <View style={theme.standardPadding}>
                <Text>
                    {transactionData.timestamp}
                </Text>
            </View>
        </View>
    );
}

export default DisplayCardTransaction;