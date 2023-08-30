import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { currencyToString } from "../../../model/utils";
import DisplayCardTransaction from "../../components/DisplayCardTransaction";

export default function SpendAcceptedScreen( { route, navigation } : {route: any, navigation: any} ) {
    const { transactionData } = route.params;

    const fiatDisplay = currencyToString(transactionData.amountFiat, 2);
    const tokenDisplay = currencyToString(transactionData.amountToken, transactionData.tokenType.decimals);

    return (
        <View>
            <View style={styles.standardPadding}>
                <Text style={styles.header}>Transaction Approved</Text>
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
                        routes: [{name: 'Home'}],
                    })          
                }
            >
                <Text style={{color:'black'}}>Back to Home</Text>
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
