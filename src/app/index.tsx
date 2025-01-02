import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import * as ImagePicker from 'expo-image-picker';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import { Debug } from '@components/Debug/Debug';
import { VectorBalls } from '@components/VectorBalls';
import { Ionicons } from '@expo/vector-icons';
import { sampleImageColors } from '@helpers/image';
import { createLog } from '@helpers/log';

const log = createLog('app');

export default () => {
  const rows = 20;
  const columns = 10;
  const [colors, setColors] = useState<vec4[]>([]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1
    });

    if (!result.canceled) {
      try {
        // Sample colors in a 10x10 grid
        const colors = await sampleImageColors(
          result.assets[0].uri,
          rows,
          columns
        );
        // log.debug('Sampled colors:', colors);
        setColors(colors);
      } catch (error) {
        log.error('Error sampling colors:', error);
      }
    }
  };

  return (
    <GestureHandlerRootView style={styles.gestureContainer}>
      <View style={styles.container}>
        <VectorBalls colors={colors} rows={rows} columns={columns} />
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
