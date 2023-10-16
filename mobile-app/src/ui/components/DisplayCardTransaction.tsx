import { StyleSheet, Text, View } from "react-native";
import { CardTransactionData } from "../../model/data/CardTransaction";
import { currencyToString, formatTokenForDisplay } from "../../utils";
import { theme } from "../Styles";
import { USDC } from "../../model/data/Tokens";
import { USDC_MINT_ADDRESS } from "../../program/program_utils";


const DisplayCardTransaction = (props: any) => {
    const transactionData = props.data;

    let tokenMint;
    if (transactionData.tokenType == USDC) tokenMint = USDC_MINT_ADDRESS;
    else tokenMint = undefined;

    const displayTokenAmount = formatTokenForDisplay(transactionData.amountToken, tokenMint)

    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h3}>
                    {displayTokenAmount} {transactionData.tokenType.name}
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
                <Text style={theme.smallText}>
                    {transactionData.timestamp}
                </Text>
            </View>
        </View>
    );
}

export default DisplayCardTransaction;