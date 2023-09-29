import { View, Text } from "react-native";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import HomeButton from "../../components/HomeButton";
import { CardTransactionData } from "../../../model/data/CardTransaction";
import { SOL, USDC } from "../../../model/data/Tokens";
import { theme } from "../../Styles";
import { useEffect } from "react";
import ConfirmationSignature from "../../components/ConfirmationSignature";

export default function SpendConfirmedScreen( { route, navigation } : { route: any, navigation: any} ) {
    const { transactionHash, transactionDataJSON } = route.params;
    const transactionData = CardTransactionData.fromJSON(transactionDataJSON);

    return (
        <View style={theme.mainContainer}>
            <View style={theme.centeredView}>
                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>Transaction Confirmed</Text>
                </View>

                <DisplayCardTransaction data={transactionData} />

                <View style={theme.standardPadding}>
                    <ConfirmationSignature data={transactionHash} />
                </View>

                <HomeButton data={navigation} />
            </View>
        </View>
    )
}
