/* eslint-disable jsx-quotes */
/* eslint-disable quotes */
/* eslint-disable prettier/prettier */
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from '../ui/screens/HomeScreen';
import TransferScreen from '../ui/screens/transfer/TransferScreen';
import TransferSelectScreen from '../ui/screens/transfer/TransferSelectScreen';
import React from 'react';
import TransferConfirmedScreen from '../ui/screens/transfer/TransferConfirmedScreen';
import SpendScreen from "../ui/screens/spend/SpendScreen";
import SpendAcceptedScreen from '../ui/screens/spend/SpendAcceptedScreen';
import SpendDeclinedScreen from '../ui/screens/spend/SpendDeclinedScreen';
import NavigationService from "./NavigationService";

const Stack = createNativeStackNavigator();

export function Route() {
    return (
        <NavigationContainer ref={(ref) => NavigationService.setTopLevelNavigator(ref)}>
            <Stack.Navigator>
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='TransferSelect' component={TransferSelectScreen} />
                <Stack.Screen name='Transfer' component={TransferScreen} />
                <Stack.Screen name='TransferConfirmed' component={TransferConfirmedScreen} />
                <Stack.Screen name='Spend' component={SpendScreen} />
                <Stack.Screen name='SpendAccepted' component={SpendAcceptedScreen} />
                <Stack.Screen name='SpendDeclined' component={SpendDeclinedScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}
