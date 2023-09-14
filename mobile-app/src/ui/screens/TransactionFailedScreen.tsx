import { View, Text } from "react-native";
import HomeButton from "../components/HomeButton";
import { theme } from "./Styles";

export default function TransactionFailedScreen( { route, navigation } : { route: any, navigation: any} ) {
    const { error } = route.params;

    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h1}>Transaction Failed</Text>
            </View>

            <View style={theme.standardPadding}>
                <Text style={theme.h2}>Error: {error}</Text>
            </View>

            <HomeButton data={navigation} />
        </View>
    )
}
