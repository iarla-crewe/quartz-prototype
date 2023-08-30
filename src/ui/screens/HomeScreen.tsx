import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { theme } from "./Styles";

export default function HomeScreen( { navigation } : { navigation: any } ) {
    // TODO - Remove dummy data
    const solBalance = 12.3;
    const usdcBalance = 40;
    const address = "6vVSxgh3Zw3yqeLwqXwV11QgcEcUQ8AM1XwhStBj3MGr";

    return (
        <View>
            <View>
                <View style={theme.standardPadding}>
                    <Text style={theme.p}>{address}</Text>
                </View>

                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>SOL: {solBalance.toString()}</Text>
                </View>

                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>USDC: {usdcBalance.toString()}</Text>
                </View>
            </View>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    () => navigation.navigate('TransferSelect')
                }
            >
                <Text style={theme.buttonText}>Transfer</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style = {theme.button}
                onPress={
                    () => navigation.navigate(
                        'Spend',
                        { date: (new Date()).toString() } // TODO - Replace dummy data
                    )
                }
            >
                <Text style={theme.buttonText}>Fake a Card Spend</Text>
            </TouchableOpacity>
        </View>
    );
}
