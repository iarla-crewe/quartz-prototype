import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SOL, TokenType, USDC } from "../../../model/data/Tokens";
import React from "react";
import { theme } from "../Styles";
import BackButton from "../../components/BackButton";
import { transferSol, transferUsdc } from "../../../program/instructions";
import { createConnection, getProgram, getProvider, getTestWallet, getVault, getVaultBalance, getVaultUsdcBalance } from "../../../program/program_utils";
import { PublicKey, TransactionConfirmationStatus } from "@solana/web3.js";

export default function TransferScreen( { route, navigation } : {route: any, navigation: any} ) {
    const { token } = route.params;
    const [ address, setAddress ] = React.useState('');
    const [ amount, setAmount ] = React.useState('');

    const connection = createConnection();
    const wallet = getTestWallet();
    const provider = getProvider(connection, wallet);
    const program = getProgram(provider); 

    const isInputValid = async () => {
        if (address == '') {
            // TODO - Display error popup
            console.log("Address is empty");
            return false;
        }

        try { new PublicKey(address) }
        catch (err) {
            // TODO - Display error popup
            console.log("Address is not a valid public key");
            return false;
        }

        if (amount == '') {
            // TODO - Display error popup
            console.log("Amount is empty");
            return false;
        }

        if (isNaN(Number(amount))) {
            // TODO - Display error popup
            console.log("Amount is not a valid number");
            return false;
        }

        let balance;
        if ( token === SOL ) {
            balance = await getVaultBalance(createConnection(), wallet.publicKey);
        } else if ( token === USDC ) {
            balance = await getVaultUsdcBalance(createConnection(), wallet.publicKey);
        } else {
            console.log("Invalid token provided")
            return false;
        }

        if (Number(amount) > balance) {
            // TODO - Display error popup
            console.log("Insufficient balance");
            return false;
        }

        return true;
    }
    
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
                        if (!(await isInputValid())) return;

                        const receiver = new PublicKey(address);
                        let tx;

                        if (token === SOL) {
                            tx = await transferSol(program, wallet.publicKey, receiver, Number(amount));
                        } else if (token === USDC) {
                            tx = await transferUsdc(connection, program, wallet, receiver, Number(amount));
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
                                'TransferConfirmed',
                                { 
                                    token: token.name, 
                                    address: address, 
                                    amount: amount,
                                    transactionHash: tx
                                }
                            )
                        } else {
                            navigation.navigate(
                                'TransactionFailed',
                                { error: "transaction was sent but not confirmed" }
                            )
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
