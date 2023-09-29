import { View, Text } from "react-native";
import HomeButton from "../../components/HomeButton";
import { theme } from "../../Styles";

export default function SpendDeclinedScreen( { route, navigation } : {route: any, navigation: any} ) {
    const { reason } = route.params;

    return (
        <View style={theme.mainContainer}>
            <View style={theme.centeredView}>
                <View style={theme.standardPadding}>
                    <Text style={theme.h1}>Transaction Declined</Text>
                </View>

                <View style={theme.standardPadding}>
                    <Text style={theme.p}>
                        {reason}
                    </Text>
                </View>

                <HomeButton data={navigation} />
            </View>
        </View>
    )
}
