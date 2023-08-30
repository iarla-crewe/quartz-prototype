import { View, Text } from "react-native";
import HomeButton from "../../components/HomeButton";
import { theme } from "../Styles";

export default function SpendDeclinedScreen( { navigation } : {navigation: any} ) {
    return (
        <View>
            <View style={theme.standardPadding}>
                <Text style={theme.h1}>Transaction Declined</Text>
            </View>

            <HomeButton data={navigation} />
        </View>
    )
}
