import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CardTransactionData } from '../../../model/data/CardTransaction'
import { SOL, USDC } from "../../../model/data/Tokens";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import { theme } from "../Styles";
import { useState, useRef, useEffect } from "react";
import { createConnection, getProgram, getProvider, getTestWallet } from "../../../program/program_utils";
import { spendSol, spendUsdc } from "../../../program/instructions";
 
export default function SpendScreen( { navigation } : { navigation: any } ) {
    // TODO - Remove dummy data
    const remainingTime = 15000;
    const transactionData = new CardTransactionData({
        amountFiat: 19,
        fiatCurrency: 'EUR',
        amountToken: 20,
        tokenType: USDC,
        timestamp: new Date(),
        vendor: 'Old Oak',
        location: 'Oliver Plunket Street'
    });

    const [timer, setTimer] = useState(remainingTime / 1000);
    const decreaseTimer = () => setTimer((prev) => prev - 1);
    useEffect(() => {
        const interval = setInterval(decreaseTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    const connection = createConnection();
    const wallet = getTestWallet();
    const provider = getProvider(connection, wallet);
    const program = getProgram(provider); 

    if (timer <= 0) {
        clearInterval(timer);
        navigation.navigate(
            'SpendDeclined',
            { reason: "Approval timed out" } // TODO - Remove hard coding of reason
        )   
    }

    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h1}>Accept transaction?</Text>
            </View>

            <DisplayCardTransaction data={transactionData} />

            <View style={theme.standardPadding}>
                <Text style={theme.h2}>Time Remaining: {timer}</Text>
            </View>
            
            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    async () => {
                        let tx;
                        if (transactionData.tokenType === SOL) {
                            tx = await spendSol(program, wallet.publicKey, transactionData.amountToken);
                        } else if (transactionData.tokenType === USDC) {
                            tx = await spendUsdc(connection, program, wallet, transactionData.amountToken);
                        } else {
                            console.log("Invalid token provided");
                            return;
                        }

                        const status = tx ? (await connection.getSignatureStatus(tx)).value?.confirmationStatus : null;

                        if (tx && status === 'confirmed') {
                            clearInterval(timer);
                            navigation.navigate('SpendAccepted');
                        } else {
                            // TODO - Implement transaction failed popup
                        }
                        
                    }       
                }
            >
                <Text style={theme.buttonText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    () => {
                        clearInterval(timer);
                        navigation.navigate(
                            'SpendDeclined',
                            { reason: "You have declined the transaction" } // TODO - Remove hard coding of reason
                        )     
                    }   
                }
            >
                <Text style={theme.buttonText}>Decline</Text>
            </TouchableOpacity>
        </View>
    )
}
