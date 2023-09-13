import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export default function App() {
  const [ showConfirm, setShowConfirm ] = useState(false);

  const playBeep = async () => {
    const { sound } = await Audio.Sound.createAsync( require('./assets/beep.wav'));
    await sound.playAsync();
    sound.unloadAsync();
  }

  const callAPI = async () => {
    try {
      const response = await fetch('https://quartzpay.io/api-demo', {
        method: 'POST',
        headers: {
          Accept: 'application/json'
        },
        body: JSON.stringify({
          firstParam: 'yourValue',
          secondParam: 'yourOtherValue',
        }),
      });

      // TODO - Handle response
      console.log(`Response: ${response}`);

      setShowConfirm(true);
      playBeep();

    } catch (err) {
      console.log(`Error: ${err}`);
    }
  }

  useEffect(() => {
    callAPI();
  }, []);

  return (
    <View style={styles.container}>
      {showConfirm ? (
        <Image
          style={styles.image}
          source={require('./assets/green_checkmark.webp')}
          contentFit="contain"
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  image: {
    flex: 1,
    width: "50%",
    backgroundColor: '#fff'
  }
});
