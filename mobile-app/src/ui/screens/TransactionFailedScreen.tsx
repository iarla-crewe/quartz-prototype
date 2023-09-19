import { View, Text } from "react-native";
import DisplayCardTransaction from "../components/DisplayCardTransaction";
import HomeButton from "../components/HomeButton";
import { CardTransactionData } from "../../model/data/CardTransaction";
import { SOL, USDC } from "../../model/data/Tokens";
import { theme } from "./Styles";
import { useEffect } from "react";
import ConfirmationSignature from "../components/ConfirmationSignature";

export default function TransactionFailedScreen( { route, navigation } : { route: any, navigation: any} ) {
    const { error } = route.params;

    return (
        <View style={theme.mainContainer}>
            <View style={theme.standardPadding}>
                <Text style={theme.h1}>Transaction Failed</Text>
            </View>

            <View style={theme.standardPadding}>
                <Text style={theme.h2}>Error: {error}</Text>
            </View>
        </View>
    )
}
