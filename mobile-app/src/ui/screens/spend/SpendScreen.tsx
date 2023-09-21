/* eslint-disable prettier/prettier */
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CardTransactionData } from '../../../model/data/CardTransaction'
import { SOL, USDC } from "../../../model/data/Tokens";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import { theme } from "../Styles";
import { useState, useRef, useEffect } from "react";
import { customParseTransferRequestURL } from "../../../utils";
import { PublicKey } from "@solana/web3.js";
import { USDC_MINT_ADDRESS } from "../../../program/program_utils";
const url = require('url');
 
export default function SpendScreen( { route , navigation } : {route: any, navigation: any} ) {
    const { solanaPayUrl, sentTime, timeLimit } : {solanaPayUrl: string, sentTime: number, timeLimit: string} = route.params;
    const { recipient, amount, splToken, reference, label, message } = customParseTransferRequestURL(JSON.parse(solanaPayUrl));

    try { Number(timeLimit) } catch {
        console.log("Error: Invalid time limit");
        return;
    }

    let tokenType;
    if (splToken == USDC_MINT_ADDRESS) tokenType = USDC;
    else tokenType = SOL;

    // Get remaining time
    let currentTime = new Date();
    let timeDifference = Number(currentTime) - Number(sentTime);
    const remainingTime = Math.floor((Number(timeLimit) - timeDifference) / 1000) * 1000;

    // TODO - Remove hardcoding of USDC to EUR price
    const usdcPrice = 0.94;

    const transactionData = new CardTransactionData({
        amountFiat: amount!.toNumber() * usdcPrice,
        fiatCurrency: 'EUR',
        amountToken: amount!.toNumber(), //This is the number ui amount
        tokenType: tokenType,
        timestamp: new Date(sentTime).toTimeString(),
        vendor: label!,
        location: message!,
        reference: reference!
    });
    
    const [timer, setTimer] = useState(remainingTime / 1000);
    const decreaseTimer = () => setTimer((prev) => prev - 1);
    useEffect(() => {
        const interval = setInterval(decreaseTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    const [isTimerEnd, setIsTimerEnd] = useState(false);

    if (timer <= 0 && !isTimerEnd) {
        clearInterval(timer);
        setIsTimerEnd(true);

        navigation.navigate(
            'SpendDeclined',
            { reason: "Approval timed out" }
        )   
    }

    return (
        <View style={theme.mainContainer}>
            <View style={theme.standardPadding}>
                <View style={theme.verticalCenteredView}>
                    <Text style={theme.h1}>Accept transaction?</Text>
                </View>
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
                                transactionDataJSON: transactionData.toJSON(),
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
