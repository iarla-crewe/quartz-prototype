/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';

import { Alert } from 'react-native';
import { notificationListeners, requestUserPermission } from './src/utils';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from './src/ui/screens/HomeScreen';
import TransferSelectScreen from './src/ui/screens/transfer/TransferSelectScreen';
import TransferScreen from './src/ui/screens/transfer/TransferScreen';
import TransferConfirmedScreen from './src/ui/screens/transfer/TransferConfirmedScreen';
import SpendScreen from './src/ui/screens/spend/SpendScreen';
import SpendAcceptedScreen from './src/ui/screens/spend/SpendAcceptedScreen';
import SpendDeclinedScreen from './src/ui/screens/spend/SpendDeclinedScreen';
import NavigationService from './src/navigation/NavigationService';


global.Buffer = require('buffer').Buffer;
const TextEncodingPolyfill = require('text-encoding');
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder
});

const Stack = createNativeStackNavigator();

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
            <Stack.Navigator initialRouteName='Home' screenOptions={{headerShown: false}}>
                <Stack.Screen name='Home' component={HomeScreen}/>
                <Stack.Screen name='TransferSelect' component={TransferSelectScreen} />
                <Stack.Screen name='Transfer' component={TransferScreen} />
                <Stack.Screen name='TransferConfirmed' component={TransferConfirmedScreen} />
                <Stack.Screen name='Spend' component={SpendScreen} />
                <Stack.Screen name='SpendAccepted' component={SpendAcceptedScreen} />
                <Stack.Screen name='SpendDeclined' component={SpendDeclinedScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    </View>
  );
}