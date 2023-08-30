import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { TokenType } from "../../../model/data/Tokens";
import React from "react";
import { theme } from "../Styles";
import BackButton from "../../components/BackButton";

export default function TransferScreen( { route, navigation } : {route: any, navigation: any} ) {
    const { tokenName } = route.params;
    const [ address, setAddress ] = React.useState('');
    const [ amount, setAmount ] = React.useState('');
    
    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h1}>{tokenName}</Text>
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
                    () => navigation.navigate(
                        'TransferConfirmed',
                        { token: tokenName, address: address, amount: amount }
                    )
                }
            >
                <Text style={theme.buttonText}>Transfer</Text>
            </TouchableOpacity>

            <BackButton data={navigation} />
        </View>
    );
}
