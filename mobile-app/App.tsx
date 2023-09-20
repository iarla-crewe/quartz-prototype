/* eslint-disable prettier/prettier */
import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, StyleSheet, View } from 'react-native';

import { Alert, Linking } from 'react-native';
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
import SpendConfirmedScreen from './src/ui/screens/spend/SpendConfirmedScreen';
import TransactionFailedScreen from './src/ui/screens/TransactionFailedScreen';


global.Buffer = require('buffer').Buffer;
const TextEncodingPolyfill = require('text-encoding');
Object.assign(global, {
  TextEncoder: TextEncodingPolyfill.TextEncoder,
  TextDecoder: TextEncodingPolyfill.TextDecoder
});

const Stack = createNativeStackNavigator();

const openSettings = () => {
  Linking.openSettings();
};

export default function App(): JSX.Element {
  useEffect(() => {
    if (Platform.OS == "android") {
      PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS).then((res) => {
        console.log("res +++++++", res);
        if (!!res && res === 'granted') {
          requestUserPermission();
          notificationListeners();
        }
        else if (res === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
          console.log('Notification Permission Denied with Never Ask Again.');
          Alert.alert(
            'Notification Permission Required',
            'App needs to send you notifications to accept or deny spend transactions. Please go to app settings and grant permission.',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Open Settings', onPress: openSettings },
            ],
          );
        }
      }).catch(error => {
        Alert.alert("Something went wrong: ", error);
      })
    } else {

    }
  })

  return (
    <View style = {styles.container}>
        <NavigationContainer ref={(ref) => NavigationService.setTopLevelNavigator(ref)}>
            <Stack.Navigator>
                <Stack.Screen name='Home' component={HomeScreen} />
                <Stack.Screen name='TransferSelect' component={TransferSelectScreen} />
                <Stack.Screen name='Transfer' component={TransferScreen} />
                <Stack.Screen name='TransferConfirmed' component={TransferConfirmedScreen} />

                <Stack.Screen name='Spend' component={SpendScreen} />
                <Stack.Screen name='SpendAccepted' component={SpendAcceptedScreen} />
                <Stack.Screen name='SpendDeclined' component={SpendDeclinedScreen} />
                <Stack.Screen name='SpendConfirmed' component={SpendConfirmedScreen} />
                <Stack.Screen name='TransactionFailed' component={TransactionFailedScreen} />        
            </Stack.Navigator>
        </NavigationContainer>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})