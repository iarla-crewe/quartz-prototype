import { View, Text, TouchableOpacity } from "react-native";
import { TokenType } from '../App'

export default function SpendScreen( { navigation } : {navigation: any} ) {
    return (
        <View>
            <View>
                <Text>Spend</Text>
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