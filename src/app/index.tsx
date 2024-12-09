import { StyleSheet, View } from 'react-native';

import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Debug } from '@components/Debug/Debug';
import { VectorBalls } from '@components/VectorBalls';

export default () => (
  <GestureHandlerRootView style={styles.gestureContainer}>
    <View style={styles.container}>
      <VectorBalls />
      {/* <Debug /> */}
    </View>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  gestureContainer: {
    flex: 1
  }
});
