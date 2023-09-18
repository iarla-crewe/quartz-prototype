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
    const { transactionData, sentTime } = route.params;

    const connection = createConnection();
    const wallet = getTestWallet();
    const provider = getProvider(connection, wallet);
    const program = getProgram(provider); 

    useEffect(() => {
        (async () => {
            let tx;

            console.log("Spend Accept: ", transactionData);
            
            if (transactionData.tokenType === SOL) {
                tx = await spendSol(program, wallet.publicKey, transactionData.amountToken!);
            } else if (transactionData.tokenType === USDC) {
                tx = await spendUsdc(connection, program, wallet, transactionData.amountToken!);
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
                    { transactionHash: tx,
                    transactionData: transactionData}
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
