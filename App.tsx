import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import TransferScreen from './screens/transfer/TransferScreen';
import TransferSelectScreen from './screens/transfer/TransferSelectScreen';
import React from 'react';
import { SafeAreaView } from 'react-native';
import TransferConfirmedScreen from './screens/transfer/TransferConfirmedScreen';
import SpendAcceptedScreen from './screens/spend/SpendAcceptedScreen';
import SpendScreen from './screens/spend/SpendScreen';
import SpendDeclinedScreen from './screens/spend/SpendDeclinedScreen';
import { TokenType } from './data/Tokens';

const Stack = createNativeStackNavigator();

export class CardTransactionData {
  amountFiat: number;
  fiatCurrency: string;
  amountToken: number;
  tokenType: TokenType;
  timestamp: Date;
  vendor: string;
  location?: string;

  constructor(
    { amountFiat, fiatCurrency, amountToken, tokenType, timestamp, vendor, location } :
    { amountFiat: number, fiatCurrency: string, amountToken: number, tokenType: TokenType, timestamp: Date, vendor: string, location: string | undefined }
  ) {
    this.amountFiat = amountFiat;
    this.fiatCurrency = fiatCurrency;
    this.amountToken = amountToken;
    this.tokenType = tokenType; 
    this.timestamp = timestamp; 
    this.vendor = vendor;
    this.location = location; 
  }
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
