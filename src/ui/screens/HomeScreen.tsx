import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen( { navigation } : {navigation: any} ) {
    const solBalance = 12.3;
    const usdcBalance = 40;
    const address = "6vVSxgh3Zw3yqeLwqXwV11QgcEcUQ8AM1XwhStBj3MGr";

    return (
        <View>
            <View style={{padding: 16}}>
                <Text style={{fontSize: 24}}>{address}</Text>
            </View>

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
                    () => navigation.navigate('TransferSelect')
                }
            >
                <Text style={{color:'black'}}>Transfer</Text>
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
                    () => navigation.navigate('Spend')
                }
            >
                <Text style={{color:'black'}}>Fake a Card Spend</Text>
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