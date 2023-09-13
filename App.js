import { StyleSheet, View, Button } from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export default function App() {
  // TODO - Implement server call code

  const [sound, setSound] = useState();

  async function playSound() {
    console.log('Loading Sound');
    const { sound } = await Audio.Sound.createAsync( require('./assets/beep.wav')
    );
    setSound(sound);

    console.log('Playing Sound');
    await sound.playAsync();
  }

  useEffect(() => {
    return sound
      ? () => {
          console.log('Unloading Sound');
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);


  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('./assets/green_checkmark.webp')}
        contentFit="contain"
      />
      <Button title="Play Sound" onPress={playSound} />
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
