/* eslint-disable prettier/prettier */
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CardTransactionData } from '../../../model/data/CardTransaction'
import { SOL, USDC } from "../../../model/data/Tokens";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import { theme } from "../Styles";
import { useState, useRef, useEffect } from "react";
import { createConnection, getProgram, getProvider, getTestWallet } from "../../../program/program_utils";
import { spendSol, spendUsdc } from "../../../program/instructions";
import { TransferRequestURL, parseURL } from "@solana/pay";
import { currencyToString, customParseTransferRequestURL } from "../../../utils";
const url = require('url');
 
export default function SpendScreen( { route , navigation } : {route: any, navigation: any} ) {
    const { solanaPayUrl, sentTime } : {solanaPayUrl: any, sentTime: number} = route.params;

    const parsedObject = JSON.parse(solanaPayUrl);

    const { recipient, amount, splToken, reference, label, message } = customParseTransferRequestURL(parsedObject);

    // TODO - Remove dummy data
    const remainingTime = 15000;

    const transactionData = new CardTransactionData({
        amountFiat: amount!.toNumber(), // TODO - change to dynamic
        fiatCurrency: 'EUR', // TODO - change to dynamic
        amountToken: amount!.toNumber(), //This is the number ui amount
        tokenType: USDC, // TODO - change to dynamic
        timestamp: new Date(sentTime).toTimeString(), //in raw format - new Date(sentTime)
        vendor: label!,
        location: message!
    });
    
    const [timer, setTimer] = useState(remainingTime / 1000);
    const decreaseTimer = () => setTimer((prev) => prev - 1);
    useEffect(() => {
        const interval = setInterval(decreaseTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    const [isTimerEnd, setIsTimerEnd] = useState(false);

    if (timer <= 0 && !isTimerEnd) {
        navigation.navigate(
            'SpendDeclined',
            { reason: "Approval timed out" }
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
                    () => {
                        clearInterval(timer);
                        setIsTimerEnd(true);

                        navigation.navigate(
                            'SpendAccepted',
                            {
                                transactionData: transactionData,
                                sentTime: sentTime
                            }
                        );
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
                        setIsTimerEnd(true);

                        navigation.navigate(
                            'SpendDeclined',
                            { reason: "You have declined the transaction" }
                        )     
                    }   
                }
            >
                <Text style={theme.buttonText}>Decline</Text>
            </TouchableOpacity>
        </View>
    )
}
