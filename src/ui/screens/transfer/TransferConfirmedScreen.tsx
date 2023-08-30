import { StyleSheet, View, Text, TouchableOpacity } from "react-native";
import { TokenType } from '../../../model/data/Tokens'

export default function TransferConfirmedScreen( { route, navigation } : {route: any, navigation: any} ) {
    const { token, address, amount } = route.params;

    return (
        <View>
            <View style={{padding: 16}}>
                <Text style={styles.largeText}>Transaction confirmed</Text>
            </View>

            <View style={{padding: 16, flexDirection: 'row'}}>
                <Text style={styles.mediumBoldText}>
                    {amount} {token.name}
                </Text>
                <Text style={styles.mediumText}>
                      sent to  
                </Text>
                <Text style={styles.mediumBoldText}>
                    {address}
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
    largeText: {
        fontSize: 32,
        color: 'black'
    },
    mediumText: {
        fontSize: 26,
        paddingHorizontal: 8
    },
    mediumBoldText: {
        fontSize: 26,
        color: 'black',
        fontWeight: 'bold'
    }
})
