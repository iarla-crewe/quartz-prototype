import { View, Text, TouchableOpacity } from "react-native";
import { TokenType } from '../App'

export default function TransferSelectScreen( { navigation } : {navigation: any} ) {
    return (
        <View>
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
                    () => navigation.navigate(
                        'Transfer', 
                        { token: TokenType.SOL }
                    )
                }
            >
                <Text style={{color:'black'}}>SOL</Text>
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
                    () => navigation.navigate(
                        'Transfer', 
                        { token: TokenType.USDC }
                    )
                }
            >
                <Text style={{color:'black'}}>USDC</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {{
                    backgroundColor: 'lightgray',
                    borderRadius: 10,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 32,
                    margin: 16,
                    padding: 16
                }}
                onPress={
                    () => navigation.goBack()
                }
            >
                <Text style={{color:'black'}}>Back</Text>
            </TouchableOpacity>
        </View>
    )
}