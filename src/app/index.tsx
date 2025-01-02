import { Pressable, StyleSheet, View } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Debug } from '@components/Debug/Debug';
import { VectorBalls } from '@components/VectorBalls';
import { Ionicons } from '@expo/vector-icons';
import { createLog } from '@helpers/log';

const log = createLog('app');

export default () => {
  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      // Handle the selected image here
      log.debug('result', result.assets[0].uri);
    }
  };

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <View style={styles.container}>
        <VectorBalls />
        {/* <Debug /> */}
        <Pressable style={styles.imagePickerButton} onPress={pickImage}>
          <Ionicons name='image' size={24} color='white' />
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black'
  },
  gestureContainer: {
    flex: 1
  },
  imagePickerButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  }
});
