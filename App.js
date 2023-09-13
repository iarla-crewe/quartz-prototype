import { StyleSheet, View, Button } from 'react-native';
import { Image } from 'expo-image';
import { Audio } from 'expo-av';
import { useEffect, useState } from 'react';

export default function App() {
  // TODO - Implement server call code

  useEffect(() => {
    async function playBeep() {
      const { sound } = await Audio.Sound.createAsync( require('./assets/beep.wav'));
      await sound.playAsync();
      sound.unloadAsync();
    }
    playBeep();
  }, []);

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source={require('./assets/green_checkmark.webp')}
        contentFit="contain"
      />
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
