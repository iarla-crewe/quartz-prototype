import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TransferScreen from './screens/TransferScreen';
import TransferSelectScreen from './screens/TransferSelectScreen';
import React from 'react';
import { SafeAreaView } from 'react-native';
import TransferConfirmedScreen from './screens/TransferConfirmedScreen';
import SpendAcceptedScreen from './screens/SpendAcceptedScreen';
import SpendScreen from './screens/SpendScreen';
import SpendDeclinedScreen from './screens/SpendDeclinedScreen';

const Stack = createNativeStackNavigator();

export enum TokenType {
  SOL = "SOL",
  USDC = "USDC"
}

export default function App(): JSX.Element {
  return (
    <SafeAreaView style={{height: "100%"}}>
      <NavigationContainer>
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
    </SafeAreaView>
  );
}
