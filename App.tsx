import HomeScreen from './screens/HomeScreen';
import React from 'react';
import {
  SafeAreaView, StyleSheet
} from 'react-native';

export default function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.container}>
      <HomeScreen />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: "100%"
  }
});
