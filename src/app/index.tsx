import { StyleSheet, View } from 'react-native';

import { VectorBalls } from '@components/VectorBalls';

export default () => (
  <View style={styles.container}>
    <VectorBalls />
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  }
});
