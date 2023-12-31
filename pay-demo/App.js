import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export default function App() {
  const [error, setError] = useState("");

  const playBeep = async () => {
    const { sound } = await Audio.Sound.createAsync( require('./assets/beep.mp3'));
    await sound.playAsync();
    sound.unloadAsync();
  }

  const callAPI = async () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: '{"destination":"cqvN9x0JSGqqwhRYja_tKj:APA91bGKAPCNurJkHcojn3BdxmeBLqzHmSUizI0ldpwtQBip7zx0alQroW5KwtC8nm0T5_-7KlK0AcC-Cwv6aYefAzauTyL-UQCfKq2qilMfEZcFg4uFxeBPbunnnhmeKBptlX7clN-R"}'
    };
    
    fetch('https://quartz-prototype-v2-server-vercel.vercel.app/api-demo', options)
      .then(response => {
        console.log(response.status);
        if(!response.ok) setError(response.status.toString());
      })
      .catch(err => {
        console.error(err);
        setError(err);
      });
  }

  useEffect(() => {
    playBeep();
    callAPI();
  })

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('./assets/green_checkmark.webp')}
        contentFit="contain"
      />
      <Text>
        {error}
      </Text>
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
