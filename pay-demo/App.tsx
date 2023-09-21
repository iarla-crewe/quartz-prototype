import { StyleSheet, View, Text } from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

const APP_TOKEN = "cK9ss8ycS0auoL_x85rl6G:APA91bGZJhSmqTmAxG5pPIlKI-73COlM-U1SHRbKpbbWWrddQQM0iq4wPhjFtIHA7Eh1DT7-HLnbUww_HWM1eHH991EjHb-wJs42SIhbPomtqUVB3IvHPNvmKILRLa5IVdU7Obdb2NrR";
const FIAT = "5.50";
const LABEL = "Impala Bar";
const LOCATION = "Washington Street, Cork"

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
      body: `
        {
          "appToken":${APP_TOKEN},
          "fiat":${FIAT},
          "label":${LABEL},
          "location":${LOCATION}
        }
      `
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
