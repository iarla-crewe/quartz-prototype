import { StyleSheet, Text, View } from "react-native";
import { CardTransactionData } from "../../model/data/CardTransaction";
import { currencyToString } from "../../utils";


const DisplayCardTransaction = (props: any) => {
    const transactionData = props.data;

    //add back if transactionData.amountToken is stored as raw amount instead of ui amount
    // const fiatDisplay = currencyToString(transactionData.amountFiat, 2);
    // const tokenDisplay = currencyToString(transactionData.amountToken, transactionData.tokenType.decimals);

    return (
        <View>
            <View style={styles.standardPadding}>
                <Text style={styles.largeText}>
                    {transactionData.amountToken} {transactionData.tokenType.name} {'('}{transactionData.amountFiat} {transactionData.fiatCurrency}{')'}
                </Text>
                <Text style={styles.mediumText}>
                    {transactionData.vendor}, {transactionData.location}
                </Text>
            </View>

            <View style={styles.standardPadding}>
                <Text>
                    {transactionData.timestamp}
                </Text>
            </View>
        </View>
    );
}

export default DisplayCardTransaction;

const styles = StyleSheet.create({
    largeText: {
        fontSize: 28,
        color: 'black'
    },
    mediumText: {
        fontSize: 24
    },
    standardPadding: {
        padding: 16
    }
})
