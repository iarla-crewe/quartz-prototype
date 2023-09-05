/* eslint-disable prettier/prettier */
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './src/ui/screens/HomeScreen';
import TransferScreen from './src/ui/screens/transfer/TransferScreen';
import TransferSelectScreen from './src/ui/screens/transfer/TransferSelectScreen';
import React, { useEffect } from 'react';
import { SafeAreaView } from 'react-native';
import TransferConfirmedScreen from './src/ui/screens/transfer/TransferConfirmedScreen';
import SpendAcceptedScreen from './src/ui/screens/spend/SpendAcceptedScreen';
import SpendScreen from './src/ui/screens/spend/SpendScreen';
import SpendDeclinedScreen from './src/ui/screens/spend/SpendDeclinedScreen';

import { Alert } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import { notification, requestUserPermission, getToken } from './src/utils';

const Stack = createNativeStackNavigator();

export default function App(): JSX.Element {
  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    requestUserPermission();
    notification();
    getToken();
  }, []);

  return (
    <SafeAreaView style={{height: "100%"}}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName='Home'>
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
