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
const url = require('url');
 
export default function SpendScreen( { route , navigation } : {route: any, navigation: any} ) {
    const { solanaPayUrl, sentTime } : any = route.params;

    console.log("url: ", solanaPayUrl);
    const protocolTest = "solana:";
    const urlTest = "jNFx1wSfb8CUxe8UZwfD3GnkBKvMqiUg69JHYM1Pi2G?amount=2&spl-token=4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU&reference=BjW6y6VQXdXYkXbJEdrbUASF9o1RCABiXD2xSXuZ2bES&label=Impala&message=Washington+street%2C+Cork+City%2C+Co.Cork"
    let transactionTest = url.parse(solanaPayUrl);
    transactionTest.protocol = protocolTest;
    //.protocol is null
    console.log("Protocol: ", transactionTest.protocol);

    const { recipient, amount, splToken, reference, label, message } = parseURL(transactionTest) as TransferRequestURL;
    console.log("Refrence", reference);
    console.log("Label", label);
    console.log("Message", message);

    // TODO - Remove dummy data
    const remainingTime = 15000;
    const transactionData = new CardTransactionData({
        amountFiat: amount!.toNumber(), // TODO - change to dynamic
        fiatCurrency: 'EUR', // TODO - change to dynamic
        amountToken: amount!.toNumber(),
        tokenType: USDC, // TODO - change to dynamic
        timestamp: new Date(sentTime),
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
                                token: transactionData.tokenType,
                                amount: transactionData.amountToken,
                                solanaPayUrl: solanaPayUrl,
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
