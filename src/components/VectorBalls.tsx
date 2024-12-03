import { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';

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
import {
  Easing,
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { vec3 } from '@helpers/glMatrixWorklet';
import { createLogger } from '@helpers/log';
import { Matrix4x4 } from '@helpers/matrix44';
import { project3d } from '@helpers/project3d';
import { Camera, Projection } from '@helpers/projection';
import { useObj } from '@hooks/useObj';
import { useVectorBallStore } from '@model/VectorBallStore';
import { Mutable, Position2, Position3 } from '@types';
import { VectorBall } from './VectorBall';
import {
  useGLMatrixProjectedObject,
  useGLMatrixProjection
} from './useGLMatrixProjection';

const log = createLogger('VectorBalls');

export const VectorBalls = () => {
  const [layout, setLayout] = useState<{ width: number; height: number }>();
  const [viewMatrix, setViewMatrix] = useState<SkMatrix>();
  const image1 = useImage(require('@assets/images/sphere-a.png'));
  const cube = useObj('sphere');

  const entities = useVectorBallStore({ length: 50 });

  // const { projection } = useProjection({
  //   width: layout?.width ?? 0,
  //   height: layout?.height ?? 0
  // });
  const { projection } = useGLMatrixProjection({
    width: layout?.width ?? 0,
    height: layout?.height ?? 0
  });

  // useEffect(() => {
  //   log.debug('cube', cube);
  // }, []);

  // const cubeObject = useProjectedObject(projection, cube, entities);
  const cubeObject = useGLMatrixProjectedObject(projection, cube, entities);
  useEffect(() => {
    // cubeObject.rotationY.value = Math.PI / 2.5;
    cubeObject.rotationY.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );
    cubeObject.rotationX.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );
    cubeObject.rotationZ.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 5000, easing: Easing.linear }),
      -1,
      false
    );

    cubeObject.scale.value = vec3.fromValues(2, 2, 2);
    cubeObject.translation.value = vec3.fromValues(0, 0, 25);
    cubeObject.translation.value = withRepeat(
      withTiming([0, 0, 10], {
        duration: 2000
        // easing: Easing.linear
      }),
      -1,
      false
    );
  }, [cubeObject]);

  useAnimatedReaction(
    () => cube,
    (cube) => {
      const count = cube.length;

      runOnJS(log.debug)(`cube length: ${count}`);
    }
  );

  return (
    <SkiaCanvas
      style={styles.canvas}
      onLayout={(event) => {
        const { width, height } = event.nativeEvent.layout;
        setLayout({ width, height });
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
  );
};

const styles = StyleSheet.create({
  canvas: {
    flex: 1,
    width: '100%'
  }
});
