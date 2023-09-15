import { View, Text } from "react-native";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import HomeButton from "../../components/HomeButton";
import { CardTransactionData } from "../../../model/data/CardTransaction";
import { SOL, USDC } from "../../../model/data/Tokens";
import { theme } from "../Styles";
import { useEffect } from "react";
import { USDC_MINT_ADDRESS, createConnection, getProgram, getProvider, getTestWallet } from "../../../program/program_utils";
import { spendSol, spendUsdc } from "../../../program/instructions";
import { TransferRequestURL, parseURL } from '@solana/pay';

export default function SpendAcceptedScreen( { route, navigation } : { route: any, navigation: any} ) {
    const { token, amount2, transaction } = route.params;

    const { recipient, amount, splToken, reference, label, message } = parseURL(transaction.solanaPayUrl) as TransferRequestURL;
    console.log("Refrence", reference);
    console.log("Label", label);
    console.log("Message", message);

    const connection = createConnection();
    const wallet = getTestWallet();
    const provider = getProvider(connection, wallet);
    const program = getProgram(provider); 

    useEffect(() => {
        (async () => {
            let tx;
            if (splToken === undefined) {
                tx = await spendSol(program, wallet.publicKey, amount!.toNumber());
            } else if (splToken === USDC_MINT_ADDRESS) {
                tx = await spendUsdc(connection, program, wallet, amount!.toNumber());
            } else {
                console.log("Invalid token provided");
                return;
            }

            if (tx instanceof Error) {
                navigation.navigate(
                    'TransactionFailed',
                    { error: tx.message }
                )
                return;
            }

            const status = (await connection.getSignatureStatus(tx)).value?.confirmationStatus

            if (status === 'confirmed') {
                navigation.navigate(
                    'SpendConfirmed',
                    { transactionHash: tx }
                );
            } else {
                navigation.navigate(
                    'TransactionFailed',
                    { error: "transaction was sent but not confirmed" }
                )
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
