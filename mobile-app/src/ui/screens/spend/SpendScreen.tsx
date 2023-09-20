/* eslint-disable prettier/prettier */
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CardTransactionData } from '../../../model/data/CardTransaction'
import { SOL, USDC } from "../../../model/data/Tokens";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import { theme } from "../Styles";
import { useState, useRef, useEffect } from "react";
import { customParseTransferRequestURL } from "../../../utils";
import { PublicKey } from "@solana/web3.js";
const url = require('url');
 
export default function SpendScreen( { route , navigation } : {route: any, navigation: any} ) {
    const { solanaPayUrl, sentTime } : {solanaPayUrl: any, sentTime: number} = route.params;

    const parsedObject = JSON.parse(solanaPayUrl);

    const { recipient, amount, splToken, reference, label, message } = customParseTransferRequestURL(parsedObject);

    let test = new PublicKey("4RhDCgDD41J5UygR5ABzXcaGPRV9Gfi4CxheZwzKX1M4");
    console.log("test: ", test);


    console.log("reference in spend screen ", reference);

    console.log("string reference in spend screen ", reference![0]);

    console.log("type of string  reference in spend screen ", typeof reference![0]);

    console.log("instance of: ", (reference![0] instanceof PublicKey))
    // TODO - Remove dummy data
    // console.log("sent time: ", sentTime);
    // let currentTime = new Date();
    // let timeDifference = Number(currentTime) - Number(sentTime);
    // console.log("time diffrence: ", timeDifference);

    // const remainingTime = 15000 - timeDifference;

    // console.log("Remaining time: ", remainingTime);

    const remainingTime = 15000

    const transactionData = new CardTransactionData({
        amountFiat: amount!.toNumber(), // TODO - change to dynamic
        fiatCurrency: 'EUR', // TODO - change to dynamic
        amountToken: amount!.toNumber(), //This is the number ui amount
        tokenType: USDC, // TODO - change to dynamic
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
