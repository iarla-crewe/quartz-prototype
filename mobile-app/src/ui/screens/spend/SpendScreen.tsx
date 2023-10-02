/* eslint-disable prettier/prettier */
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CardTransactionData } from '../../../model/data/CardTransaction'
import { SOL, USDC } from "../../../model/data/Tokens";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import { theme } from "../../Styles";
import { useState, useRef, useEffect } from "react";
import { customParseTransferRequestURL } from "../../../utils";
import { PublicKey } from "@solana/web3.js";
import { USDC_MINT_ADDRESS } from "../../../program/program_utils";
const url = require('url');
 
export default function SpendScreen( { route , navigation } : {route: any, navigation: any} ) {
    const { solanaPayUrl, sentTime, timeLimit, amountFiat } : {solanaPayUrl: string, sentTime: number, timeLimit: string, amountFiat: string} = route.params;
    const { recipient, amount, splToken, reference, label, message } = customParseTransferRequestURL(JSON.parse(solanaPayUrl));

    if (isNaN(Number(timeLimit))) {
        console.log(`Error: Time limit ${timeLimit} is not a number`);
        return;
    }

    if (isNaN(Number(amountFiat))) {
        console.log(`Error: Fiat amount ${amountFiat} is not a number`);
        return;
    }

    // TODO - Remove hardcoding of USDC/SOL to EUR prices
    const usdcPrice = 0.94;
    const solPrice = 18.83;

    let tokenType;
    if (splToken instanceof PublicKey && splToken.toBase58() === USDC_MINT_ADDRESS.toBase58()) tokenType = USDC;
    else tokenType = SOL;

    const transactionData = new CardTransactionData({
        amountFiat: Number(amountFiat),
        fiatCurrency: 'EUR',
        amountToken: amount!.toNumber(),
        tokenType: tokenType,
        timestamp: new Date(sentTime).toTimeString(),
        vendor: label!,
        location: message!,
        reference: reference!
    });

    const getRemainingTime = () => {
        const timeDifference = Number(new Date()) - Number(sentTime);
        return Math.floor((Number(timeLimit) - timeDifference) / 1000);
    }
    
    const [timer, setTimer] = useState(getRemainingTime());
    useEffect(() => {
        const interval = setInterval(() => {
            const remainingTime = getRemainingTime();

            setTimer(remainingTime);
            if (remainingTime <= 0) {
                navigation.reset({
                    index: 0,
                    routes: [{
                        name: 'SpendDeclined', 
                        params: { reason: "Approval timed out" }
                    }],
                });
            }
        }, 1000);

        return () => {
            clearInterval(interval);
        }
    }, []);

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
                onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{
                            name: 'SpendAccepted', 
                            params: {
                                transactionDataJSON: transactionData.toJSON(),
                                sentTime: sentTime
                            }
                        }],
                    }); 
                } }
            >
                <Text style={theme.buttonText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={() => {
                    navigation.reset({
                        index: 0,
                        routes: [{
                            name: 'SpendDeclined', 
                            params: { reason: "You have declined the transaction" }
                        }],
                    }); 
                }}
            >
                <Text style={theme.buttonText}>Decline</Text>
            </TouchableOpacity>
        </View>
    )
}
