import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen({ navigation } : {navigation: any} ) {
    const solBalance = 12.3;
    const usdcBalance = 40;

    return (
        <View>
            <View style={styles.tokenBalance}>
                <Text style={styles.largeText}>SOL: {solBalance.toString()}</Text>
            </View>

            <View style={styles.tokenBalance}>
                <Text style={styles.largeText}>USDC: {usdcBalance.toString()}</Text>
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
                    () => navigation.navigate('Transfer')
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
    tokenBalance: {
        flexDirection: 'row', 
        padding: 16
    }
})