/* eslint-disable prettier/prettier */
import messaging from '@react-native-firebase/messaging';
import NavigationService from './navigation/NavigationService';
import { PublicKey } from '@solana/web3.js';
import { ParseURLError, TransferRequestURL } from '@solana/pay';
import BigNumber from 'bignumber.js';

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
    console.log('A new FCM message arrived!');
    console.log("Remote message", remoteMessage)
    console.log("solana pay url:", remoteMessage.data!.urlObj)

    NavigationService.navigate(remoteMessage.data!.screenToOpen, { 
      solanaPayUrl: remoteMessage.data!.urlObj, 
      sentTime: remoteMessage.sentTime 
    });
  });
  // Assume a message-notification contains a "type" property in the data payload of the screen to open

  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log(
      'Notification caused app to open from background state:',
      remoteMessage.notification,
    );
    NavigationService.navigate(remoteMessage.data!.screenToOpen, { 
      solanaPayUrl: remoteMessage.data!.urlObj, 
      sentTime: remoteMessage.sentTime 
    });
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
        NavigationService.navigate(remoteMessage.data!.screenToOpen, { 
          solanaPayUrl: remoteMessage.data!.urlObj, 
          sentTime: remoteMessage.sentTime 
        });
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

export const getSolPrice = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=eur`,
    {
      method: "GET",
    }
  );

  const data = await response.json();
  return data.solana.eur;
};

export const getUsdcPrice = async () => {
  const response = await fetch(
    `https://api.coingecko.com/api/v3/simple/price?ids=usd-coin&vs_currencies=eur`,
    {
      method: "GET",
    }
  );

  const data = await response.json();
  return data["usd-coin"].eur;
};

export function customParseTransferRequestURL(obj: any): TransferRequestURL {
  let recipient: PublicKey;
  try {
      recipient = new PublicKey(obj.pathname);
  } catch (error: any) {
      throw new ParseURLError('recipient invalid');
  }

  let amount: BigNumber | undefined;
  const amountParam = obj.searchParams.amount;
  if (amountParam != null) {
      if (!/^\d+(\.\d+)?$/.test(amountParam)) throw new ParseURLError('amount invalid');

      amount = new BigNumber(amountParam);
      if (amount.isNaN()) throw new ParseURLError('amount NaN');
      if (amount.isNegative()) throw new ParseURLError('amount negative');
  }

  let splToken: PublicKey | undefined;
  const splTokenParam = obj.searchParams['spl-token'];
  if (splTokenParam != null) {
      try {
          splToken = new PublicKey(splTokenParam);
      } catch (error) {
          throw new ParseURLError('spl-token invalid');
      }
  }

  let reference: PublicKey[] | undefined;
  const referenceParam = obj.searchParams.reference;
  if (referenceParam != "") {
      try {
          reference = [new PublicKey(referenceParam)];
      } catch (error) {
          throw new ParseURLError('reference invalid');
      }
  }

  const label = obj.searchParams.label || undefined;
  const message = obj.searchParams.message || undefined;
  const memo = obj.searchParams.memo || undefined;

  return {
      recipient,
      amount,
      splToken,
      reference,
      label,
      message,
      memo,
  };
}
