import { View, Text, TouchableOpacity } from "react-native";
import { TokenType } from '../App'

export default function SpendDeclinedScreen( { navigation } : {navigation: any} ) {
    return (
        <View>
            <View style={{padding: 16}}>
                <Text>Transaction Declined</Text>
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