/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, View } from 'react-native';
import { Alert } from 'react-native';
import { notificationListeners, requestUserPermission } from './src/utils';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavigationService from './src/navigation/NavigationService';

import HomeScreen from './src/ui/screens/HomeScreen';
import TransferScreen from './src/ui/screens/transfer/TransferScreen';
import TransferConfirmedScreen from './src/ui/screens/transfer/TransferConfirmedScreen';
import SpendScreen from './src/ui/screens/spend/SpendScreen';
import SpendAcceptedScreen from './src/ui/screens/spend/SpendAcceptedScreen';
import SpendDeclinedScreen from './src/ui/screens/spend/SpendDeclinedScreen';
import TransactionFailedScreen from './src/ui/screens/TransactionFailedScreen';
import DepositScreen from './src/ui/screens/DepositScreen';
import TokenSelectScreen from './src/ui/screens/transfer/TokenSelectScreen';


global.Buffer = require('buffer').Buffer;
const TextEncodingPolyfill = require('text-encoding');
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TransferStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='TokenSelect' component={TokenSelectScreen} />
      <Stack.Screen name='Transfer' component={TransferScreen} />
      <Stack.Screen name='TransferConfirmed' component={TransferConfirmedScreen} />
      <Stack.Screen name='TransactionFailed' component={TransactionFailedScreen} />
    </Stack.Navigator>
  )
}

function SpendStackNavigator() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name='Spend' component={SpendScreen} />
      <Stack.Screen name='SpendAccepted' component={SpendAcceptedScreen} />
      <Stack.Screen name='SpendDeclined' component={SpendDeclinedScreen} />
      <Stack.Screen name='TransactionFailed' component={TransactionFailedScreen} />
    </Stack.Navigator>
  )
}

function TabNavigator() {
  return (
    <Tab.Navigator screenOptions={{headerShown: false}}>
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Deposit' component={DepositScreen} />
      <Tab.Screen name='Transfer' component={TransferStackNavigator} />
    </Tab.Navigator>
  )
}

function MainStackNavigator() {
  return (
    <Stack.Navigator initialRouteName='Tabs' screenOptions={{headerShown: false}}>
        <Stack.Screen name='Tabs' component={TabNavigator}/>
        <Stack.Screen name='Spend' component={SpendStackNavigator} />
    </Stack.Navigator>
  )
}

export default function App(): JSX.Element {
  useEffect(() => {
    if (Platform.OS == "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then((res) => {
        console.log("res +++++++", res);
        if (!!res && res === 'granted') {
          requestUserPermission();
          notificationListeners();
        }
      }).catch(error => {
        Alert.alert("Something went wrong: ", error);
      })
    } else {

    }
  })

  return (
    <View style = {{flex: 1}}>
      <NavigationContainer ref={(ref) => NavigationService.setTopLevelNavigator(ref)}>
        <MainStackNavigator />
      </NavigationContainer>
    </View>
  );
}