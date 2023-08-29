import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { TokenType } from "../App";
import React from "react";

export default function TransferScreen( { route, navigation } : {route: any, navigation: any} ) {
    const { tokenType } = route.params;
    const [ address, setAddress ] = React.useState('');
    const [ amount, setAmount ] = React.useState('');
    
    return (
        <View>
            <View style={styles.viewPadding}>
                <Text style={styles.largeText}>{tokenType}</Text>
            </View>

            <View style={styles.viewPadding}>
                <TextInput
                    style={styles.textInput}
                    value={address}
                    onChangeText={text => setAddress(text)}
                    placeholder="Recipient's Solana Address"
                />
            </View>

            <View style={styles.viewPadding}>
                <TextInput
                    style={styles.textInput}
                    value={amount}
                    onChangeText={text => setAmount(text)}
                    placeholder="Amount"
                />
            </View>

            <TouchableOpacity 
                style = {{
                    backgroundColor: 'lightgray',
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    margin: 16,
                    padding: 16
                }}
                onPress={
                    () => {}
                }
            >
                <Text style={{color:'black'}}>Transfer</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    largeText: {
        fontSize: 32,
        color: 'black'
    },
    viewPadding: {
        padding: 16
    },
    textInput: {
        width: "100%",
        paddingHorizontal: 8,
        backgroundColor: "white"
    }
});
