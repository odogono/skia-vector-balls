import { useEffect, useState } from 'react';
import { LayoutRectangle, StyleSheet } from 'react-native';

import {
  Blur,
  Group,
  Image,
  SkImage,
  SkMatrix,
  Skia,
  Canvas as SkiaCanvas,
  useImage
} from '@shopify/react-native-skia';
import { GestureDetector } from 'react-native-gesture-handler';
import {
  Easing,
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { vec3 } from '@helpers/glMatrixWorklet';
import { createLogger } from '@helpers/log';
import { useObj } from '@hooks/useObj';
import { useVectorBallStore } from '@model/VectorBallStore';
import { VectorBall } from './VectorBall';
import {
  useGLMatrixProjectedObject,
  useGLMatrixProjection
} from './useGLMatrixProjection';
import { useTrackballRotator } from './useTrackballRotator';

const log = createLogger('VectorBalls');

export const VectorBalls = () => {
  const [layout, setLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0
  });
  const [viewMatrix, setViewMatrix] = useState<SkMatrix>();
  const image1 = useImage(require('@assets/images/sphere-a.png'));
  const cube = useObj('cylinder');

  const entities = useVectorBallStore({ length: 80 });

  // const { projection } = useProjection({
  //   width: layout?.width ?? 0,
  //   height: layout?.height ?? 0
  // });
  const { projection } = useGLMatrixProjection({
    layout
  });

  const { gesture, props } = useTrackballRotator({
    layout,
    viewDistance: 30,
    viewpointDirection: [0, 0, 1],
    viewUp: [0, 1, 0]
  });
  // useEffect(() => {
  //   log.debug('cube', cube);
  // }, []);

  // useDerivedValue(() => {
  //   runOnJS(log.debug)('trackballViewMatrix', trackballViewMatrix.value);
  //   return trackballViewMatrix.value;
  // });

  // useAnimatedReaction(
  //   () => props.value.viewMatrix,
  //   (viewMatrix) => {
  //     runOnJS(log.debug)('🙌 viewMatrix changed', viewMatrix);
  //   }
  // );

  // const cubeObject = useProjectedObject(projection, cube, entities);
  const cubeObject = useGLMatrixProjectedObject({
    projection,
    props,
    // modelView: props.value.viewMatrix,
    points: cube,
    entities
  });
  useEffect(() => {
    // cubeObject.rotationY.value = Math.PI / 2.5;
    cubeObject.rotationY.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );
    // cubeObject.rotationX.value = withRepeat(
    //   withTiming(Math.PI * 2, { duration: 5000, easing: Easing.linear }),
    //   -1,
    //   false
    // );
    // cubeObject.rotationZ.value = withRepeat(
    //   withTiming(Math.PI * 2, { duration: 5000, easing: Easing.linear }),
    //   -1,
    //   false
    // );
    cubeObject.scale.value = vec3.fromValues(2, 3, 2);
    // cubeObject.translation.value = vec3.fromValues(0, 0, 25);
    // cubeObject.translation.value = withRepeat(
    //   withTiming([0, 0, 10], {
    //     duration: 2000
    //     // easing: Easing.linear
    //   }),
    //   -1,
    //   false
    // );
  }, [cubeObject]);

  useAnimatedReaction(
    () => cube,
    (cube) => {
      const count = cube.length;

      runOnJS(log.debug)(`cube length: ${count}`);
    }
  );

  return (
    <GestureDetector gesture={gesture}>
      <SkiaCanvas
        style={styles.canvas}
        onLayout={(event) => {
          setLayout(event.nativeEvent.layout);
          const m = Skia.Matrix();
          // m.translate(width / 2, height / 2);
          setViewMatrix(m);
        }}
      >
        <Group matrix={viewMatrix}>
          {entities.map((entity, index) => (
            <VectorBall
              key={`vb-${index}`}
              image={image1}
              blurValue={entity.blur}
              size={entity.size}
              pos={entity.screenPos}
            />
          ))}
        </Group>
      </SkiaCanvas>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    width: '100%'
  }
});
