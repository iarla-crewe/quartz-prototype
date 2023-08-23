import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TransferScreen from './screens/TransferScreen';
import TransferSelectScreen from './screens/TransferSelectScreen';
import React from 'react';
import {
  SafeAreaView, StyleSheet
} from 'react-native';

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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}
