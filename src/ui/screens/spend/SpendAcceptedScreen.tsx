import { View, Text } from "react-native";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import HomeButton from "../../components/HomeButton";
import { CardTransactionData } from "../../../model/data/CardTransaction";
import { SOL, USDC } from "../../../model/data/Tokens";
import { theme } from "../Styles";
import { useEffect } from "react";
import { createConnection, getProgram, getProvider, getTestWallet } from "../../../program/program_utils";
import { spendSol, spendUsdc } from "../../../program/instructions";

export default function SpendAcceptedScreen( { route, navigation } : { route: any, navigation: any} ) {
    const { token, amount } = route.params;

    const connection = createConnection();
    const wallet = getTestWallet();
    const provider = getProvider(connection, wallet);
    const program = getProgram(provider); 

    useEffect(() => {
        (async () => {
            let tx;
            if (token === SOL) {
                tx = await spendSol(program, wallet.publicKey, amount);
            } else if (token === USDC) {
                tx = await spendUsdc(connection, program, wallet, amount);
            } else {
                console.log("Invalid token provided");
                return;
            }

            const status = tx ? (await connection.getSignatureStatus(tx)).value?.confirmationStatus : null;

            if (tx && status === 'confirmed') {
                navigation.navigate(
                    'SpendConfirmed',
                    { transactionHash: tx }
                );
            } else {
                // TODO - Implement transaction failed screen
            }

        })();
        return () => {}
    }, []);

    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h1}>Transaction Approved</Text>
            </View>

            <View style={theme.standardPadding}>
                <Text style={theme.p}>Waiting for confirmation..</Text>
            </View>
        </View>
    )
}
