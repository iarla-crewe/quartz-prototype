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
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json', 'User-Agent': 'insomnia/2023.5.8'},
      body: '{"destination":"cqvN9x0JSGqqwhRYja_tKj:APA91bGKAPCNurJkHcojn3BdxmeBLqzHmSUizI0ldpwtQBip7zx0alQroW5KwtC8nm0T5_-7KlK0AcC-Cwv6aYefAzauTyL-UQCfKq2qilMfEZcFg4uFxeBPbunnnhmeKBptlX7clN-R"}'
    };
    
    fetch('https://quartz-prototype-v2-server-vercel.vercel.app/api-demo', options)
      .then(response => {
        console.log(response.status);
        if (response.ok) {
          setShowConfirm(true);
          playBeep();
        }
      })
      .catch(err => console.error(err));
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
