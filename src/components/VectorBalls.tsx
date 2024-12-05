import { useEffect, useState } from 'react';
import { LayoutRectangle, StyleSheet } from 'react-native';

import {
  Group,
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

import { vec3 } from '@3d/glMatrixWorklet';
import {
  useGLMatrixProjectedObject,
  useGLMatrixProjection
} from '@3d/hooks/useGLMatrixProjection';
import { useQTrackballRotator } from '@3d/hooks/useQTrackballRotator';
import { useVectorBallStore } from '@3d/model/VectorBallStore';
import { createLogger } from '@helpers/log';
import { useObj } from '@hooks/useObj';
import { VectorBall } from './VectorBall';

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

  const { projection } = useGLMatrixProjection({
    layout
  });

  const { gesture, props } = useQTrackballRotator({
    layout
  });

  const cubeObject = useGLMatrixProjectedObject({
    projection,
    props,
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
    cubeObject.scale.value = vec3.fromValues(2, 5, 2);
    cubeObject.translation.value = vec3.fromValues(0, 0, 15);
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
