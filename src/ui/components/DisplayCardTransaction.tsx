import { StyleSheet, Text, View } from "react-native";
import { CardTransactionData } from "../../model/data/CardTransaction";
import { currencyToString } from "../../model/utils";


const DisplayCardTransaction = (props: any) => {
    const transactionData = props.data;

    const fiatDisplay = currencyToString(transactionData.amountFiat, 2);
    const tokenDisplay = currencyToString(transactionData.amountToken, transactionData.tokenType.decimals);

    return (
        <View>
            <View style={styles.standardPadding}>
                <Text style={styles.largeText}>
                    {tokenDisplay} {transactionData.tokenType.name} {'('}{fiatDisplay} {transactionData.fiatCurrency}{')'}
                </Text>
                <Text style={styles.mediumText}>
                    {transactionData.vendor}, {transactionData.location}
                </Text>
            </View>

            <View style={styles.standardPadding}>
                <Text>
                    {transactionData.timestamp.toString()}
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
