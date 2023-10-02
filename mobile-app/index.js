/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import 'react-native-get-random-values';
import 'react-native-url-polyfill';
import messaging from '@react-native-firebase/messaging';
import NavigationService from './src/navigation/NavigationService';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);

  try {
    NavigationService.navigate(remoteMessage.data.navigationFlow, {
      screen: remoteMessage.data.screenToOpen,
      params: {
        solanaPayUrl: remoteMessage.data.urlObj,
        sentTime: remoteMessage.sentTime,
        timeLimit: remoteMessage.data.timeLimit,
        amountFiat: remoteMessage.data.amountFiat
      }
    });
  } catch (error) {
    console.log("Cant navigate, there is not remote message, ", error);
  }

});

AppRegistry.registerComponent(appName, () => App);
