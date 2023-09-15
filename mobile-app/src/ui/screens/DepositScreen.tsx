import { View, Text, TouchableOpacity } from "react-native";
import Clipboard from "@react-native-community/clipboard";
import { useState, useEffect } from 'react';
import { theme } from "./Styles";
import { getTestWallet } from "../../program/program_utils";
import {useNavigationState} from '@react-navigation/native';


export default function DepositScreen() {
    const address = getTestWallet().publicKey.toBase58();
    const firstPart = address.slice(0, 4);
    const lastPart = address.slice(-4);

    const [buttonText, setButtonText] = useState("Copy");
    const navigationState = useNavigationState(state => state);
    useEffect(() => {
        setButtonText("Copy");
    }, [navigationState]);

    return (
        <View style={theme.mainContainer}>
            <View style={theme.centeredView}>
                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>
                        Address
                    </Text>
                </View>
                
                <View style={theme.standardPadding}>
                    <Text style={theme.p}>
                        {firstPart}...{lastPart}
                    </Text>
                </View>

                <TouchableOpacity 
                    style={theme.button}
                    onPress={() => {
                        Clipboard.setString(address);
                        setButtonText("Copied!");
                    }}
                >
                    <Text style={theme.buttonText}>{buttonText}</Text>    
                </TouchableOpacity>
            </View>
        </View>
    )
}
