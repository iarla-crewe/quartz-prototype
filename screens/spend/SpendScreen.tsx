import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CardTransactionData } from '../../App'
import { USDC } from "../../data/Tokens";
import { currencyToString } from "../../utils";

export default function SpendScreen( { navigation } : {navigation: any} ) {
    const transactionData = new CardTransactionData({
        amountFiat: 1050,
        fiatCurrency: 'EUR',
        amountToken: 1147,
        tokenType: new USDC(),
        timestamp: new Date(),
        vendor: 'Old Oak',
        location: 'Oliver Plunket Street'
    });

    const fiatDisplay = currencyToString(transactionData.amountFiat, 2);
    const tokenDisplay = currencyToString(transactionData.amountToken, transactionData.tokenType.decimals);

    return (
        <View>
            <View style={styles.standardPadding}>
                <Text style={styles.header}>Accept transaction?</Text>
            </View>

            <View style={styles.standardPadding}>
                <Text style={styles.largeText}>
                    {tokenDisplay} {transactionData.tokenType.name} {'('}{fiatDisplay} {transactionData.fiatCurrency}{')'}
                </Text>
                <Text style={styles.mediumText}>
                    {transactionData.vendor}, {transactionData.location}
                </Text>
            </View>

            <View style={styles.standardPadding}>
                <Text>
                    {transactionData.timestamp.toString()}
                </Text>
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
                    () => navigation.reset({
                        index: 0,
                        routes: [{name: 'SpendAccepted'}],
                    })          
                }
            >
                <Text style={{color:'black'}}>Accept</Text>
            </TouchableOpacity>

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
                    () => navigation.reset({
                        index: 0,
                        routes: [{name: 'SpendDeclined'}],
                    })          
                }
            >
                <Text style={{color:'black'}}>Decline</Text>
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({
    header: {
        fontSize: 32,
        color: 'black'
    },
    largeText: {
        fontSize: 28,
        color: 'black'
    },
    mediumText: {
        fontSize: 24
    },
    standardPadding: {
        padding: 16
    }
})
