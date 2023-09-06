import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SOL, TokenType, USDC } from "../../../model/data/Tokens";
import React from "react";
import { theme } from "../Styles";
import BackButton from "../../components/BackButton";
import { transferSol, transferUsdc } from "../../../program/instructions";
import { createConnection, getProgram, getProvider, getTestWallet, getVault } from "../../../program/program_utils";
import { PublicKey, TransactionConfirmationStatus } from "@solana/web3.js";

export default function TransferScreen( { route, navigation } : {route: any, navigation: any} ) {
    const { token } = route.params;
    const [ address, setAddress ] = React.useState('');
    const [ amount, setAmount ] = React.useState('');

    const connection = createConnection();
    const wallet = getTestWallet();
    const provider = getProvider(connection, wallet);
    const program = getProgram(provider); 
    
    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h1}>{token.name}</Text>
            </View>

            <View style={theme.standardPadding}>
                <TextInput
                    style={theme.textInput}
                    value={address}
                    onChangeText={text => setAddress(text)}
                    placeholder="Recipient's Solana Address"
                />
            </View>

            <View style={theme.standardPadding}>
                <TextInput
                    style={theme.textInput}
                    value={amount}
                    onChangeText={text => setAmount(text)}
                    placeholder="Amount"
                />
            </View>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    async () => {
                        let tx;
                        const receiver = new PublicKey(address);

                        let amountNum;
                        try {
                            amountNum = Number(amount);
                        } catch (err) {
                            console.log(err)
                            return;
                        }

                        if (token === SOL) {
                            tx = await transferSol(program, wallet.publicKey, receiver, amountNum);
                        } else if (token === USDC) {
                            tx = await transferUsdc(connection, program, wallet, receiver, amountNum);
                        } else {
                            console.log("Invalid token provided");
                            return;
                        }

                        const status = tx ? (await connection.getSignatureStatus(tx)).value?.confirmationStatus : null;

                        if (tx && status === 'confirmed') {
                            navigation.navigate(
                                'TransferConfirmed',
                                { 
                                    token: token.name, 
                                    address: address, 
                                    amount: amount,
                                    transactionHash: tx
                                }
                            )
                        } else {
                            // TODO - Implement transaction failed popup
                        }
                    }
                }
            >
                <Text style={theme.buttonText}>Transfer</Text>
            </TouchableOpacity>

            <BackButton data={navigation} />
        </View>
    );
}
