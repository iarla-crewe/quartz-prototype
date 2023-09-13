import { StyleSheet, View } from 'react-native';
import { Image } from 'expo-image';

export default function App() {
  // TODO - Implement server call code

  // TODO - Implement beep sound effect

  return (
    <View style={styles.container}>
      <Image
        style={styles.image}
        source="https://assets-global.website-files.com/60157e38af986c4fb2b69244/60f0ed18a47298cb2d9d8ab8_Eo_circle_green_checkmark.svg.webp"
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
