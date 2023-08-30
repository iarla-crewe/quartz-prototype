import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { CardTransactionData } from '../../../model/data/CardTransaction'
import { USDC } from "../../../model/data/Tokens";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";

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

    return (
        <View>
            <View style={styles.standardPadding}>
                <Text style={styles.header}>Accept transaction?</Text>
            </View>

            <DisplayCardTransaction data={transactionData} />
            
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
                        actions: [
                            navigation.navigate(
                                'SpendAccepted',
                                { transactionData: transactionData }
                            )
                        ],
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
    standardPadding: {
        padding: 16
    }
})
