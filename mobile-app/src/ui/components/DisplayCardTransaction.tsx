import { StyleSheet, Text, View } from "react-native";
import { CardTransactionData } from "../../model/data/CardTransaction";
import { currencyToString } from "../../utils";
import { theme } from "../screens/Styles";


const DisplayCardTransaction = (props: any) => {
    const transactionData = props.data;

    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h3}>
                    {transactionData.amountToken} {transactionData.tokenType.name}
                </Text>
                <Text style={theme.h3}>
                    {'('}{transactionData.amountFiat} {transactionData.fiatCurrency}{')'}
                </Text>
            </View>

            <View style={theme.halfPadding}>
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