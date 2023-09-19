import React, { useEffect } from 'react';
import { PermissionsAndroid, Platform, SafeAreaView, StyleSheet } from 'react-native';
import { Alert } from 'react-native';
import { notificationListeners, requestUserPermission } from './src/utils';
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NavigationService from './src/navigation/NavigationService';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { themeColor } from './src/ui/screens/Styles';

import HomeScreen from './src/ui/screens/HomeScreen';
import TransferScreen from './src/ui/screens/transfer/TransferScreen';
import TransferConfirmedScreen from './src/ui/screens/transfer/TransferConfirmedScreen';
import SpendScreen from './src/ui/screens/spend/SpendScreen';
import SpendAcceptedScreen from './src/ui/screens/spend/SpendAcceptedScreen';
import SpendDeclinedScreen from './src/ui/screens/spend/SpendDeclinedScreen';
import SpendConfirmedScreen from './src/ui/screens/spend/SpendConfirmedScreen';
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
    <Tab.Navigator
      initialRouteName='Home'
      safeAreaInsets={{ bottom: 0 }}
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === 'Deposit') {
            iconName = focused ? 'card-plus' : 'card-plus-outline';
          } else if (route.name === 'Send') {
            iconName = focused ? 'send' : 'send-outline';
          } else {  // Home
            iconName = focused ? 'home' : 'home-outline';
          }

          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeColor.secondary,
        tabBarInactiveTintColor: themeColor.darkGrey,
        tabBarStyle: {
          borderTopWidth: 0,
        },
      })}
    >
      <Tab.Screen name='Home' component={HomeScreen} />
      <Tab.Screen name='Deposit' component={DepositScreen} />
      <Tab.Screen name='Send' component={TransferStackNavigator} />
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
    <SafeAreaView style = {{flex: 1, backgroundColor: themeColor.primary}}>
      <NavigationContainer ref={(ref) => NavigationService.setTopLevelNavigator(ref)}>
        <MainStackNavigator />
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  }
})