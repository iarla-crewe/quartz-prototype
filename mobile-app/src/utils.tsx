/* eslint-disable prettier/prettier */
import messaging from '@react-native-firebase/messaging';
import NavigationService from './navigation/NavigationService';

export function currencyToString(rawAmount: number, decimals: number) {
  return (rawAmount / 10 ** decimals).toFixed(decimals);
}

export function handleError(error: unknown, message?: string) {
  console.log(`${message ? message : ""} ${error}`);

  if (typeof error === "string") {
    return new Error(error);
  } else if (error instanceof Error) {
    return error;
  } else {
    return new Error("unknown error");
  }
}

export async function requestUserPermission() {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
    getToken();
  }
}

export const notificationListeners = async () => {
  const unsubscribe = messaging().onMessage(async remoteMessage => {
    console.log('A new FCM message arrived!', remoteMessage);
    NavigationService.navigate(remoteMessage.data!.screenToOpen);
  });
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    NavigationService.navigate(remoteMessage.data!.screenToOpen);
  });

  // Check whether an initial notification is available
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log(
          'Notification caused app to open from quit state:',
          remoteMessage.notification,
        );
        NavigationService.navigate(remoteMessage.data!.screenToOpen);
      }
    });

  return unsubscribe;
};

export const getToken = async () => {
  await messaging().registerDeviceForRemoteMessages();
  const token = await messaging().getToken();
  // save the token to the db
  console.log(`Token: ${token}`);
};
