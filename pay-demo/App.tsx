import { StyleSheet, View, Text, Button } from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

// App tokens (logged to console when main mobile app is ran) from each device, used to locate users for notifications
// Comment out all but the one you want to use

// Iarla's Samsung A13
//const APP_TOKEN = "cK9ss8ycS0auoL_x85rl6G:APA91bGZJhSmqTmAxG5pPIlKI-73COlM-U1SHRbKpbbWWrddQQM0iq4wPhjFtIHA7Eh1DT7-HLnbUww_HWM1eHH991EjHb-wJs42SIhbPomtqUVB3IvHPNvmKILRLa5IVdU7Obdb2NrR";

// Diego's Samsung S10e
// const APP_TOKEN = "dzSK6r4FTIusRVUgh3f50D:APA91bEPALE-e5QgCS1vegrizdJX3m_oxoK1d-_haXPq7aGlw-1Eq8scVnTINRrWUM4nGUdX_hNau0sEKAKKm-1VAOBWRu0__fhHODuvHy9KuLoJoL1zMY-wqkQPNhz89MhVyQdvVH3g";

// Tester's Device
const APP_TOKEN = "";

const FIAT = "5.50";
const LABEL = "Impala Bar";
const LOCATION = "Washington Street, Cork"

export default function App() {
  const [error, setError] = useState("");
  const [sound, setSound] = useState<Audio.Sound | undefined>();

  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(require('./assets/beep.mp3'));
    setSound(sound);

    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);

  const callAPI = async () => {
    const options = {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: `
        {
          "appToken":"${APP_TOKEN}",
          "fiat":"${FIAT}",
          "label":"${LABEL}",
          "location":"${LOCATION}"
        }
      `
    };
    
    fetch('https://www.quartzpay.io/api/demo', options)
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
    playSound();
    callAPI();
  }, [])

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
