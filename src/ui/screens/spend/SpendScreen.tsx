import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CardTransactionData } from '../../../model/data/CardTransaction'
import { USDC } from "../../../model/data/Tokens";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";
import { theme } from "../Styles";
import { useState, useRef, useEffect } from "react";
 
export default function SpendScreen( { route, navigation } : { route: any, navigation: any } ) {
    // TODO - Remove dummy data
    const remainingTime = 15000;
    const { date } = route.params;
    const transactionData = new CardTransactionData({
        amountFiat: 1050,
        fiatCurrency: 'EUR',
        amountToken: 1147,
        tokenType: USDC,
        timestamp: date,
        vendor: 'Old Oak',
        location: 'Oliver Plunket Street'
    });

    const [timer, setTimer] = useState(remainingTime / 1000);

    const decreaseTimer = () => setTimer((prev) => prev - 1);
    useEffect(() => {
        const interval = setInterval(decreaseTimer, 1000);

        return () => clearInterval(interval);
    }, []);

    if (timer <= 0) {
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
                    () => navigation.navigate('SpendAccepted')          
                }
            >
                <Text style={theme.buttonText}>Accept</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    () => navigation.navigate(
                        'SpendDeclined',
                        { reason: "You have declined the transaction" } // TODO - Remove hard coding of reason
                    )        
                }
            >
                <Text style={theme.buttonText}>Decline</Text>
            </TouchableOpacity>
        </View>
    )
}
