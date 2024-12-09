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
import { useQTrackballRotator } from '@3d/hooks/useQTrackballRotator';
import { useVBCamera } from '@3d/hooks/useVBCamera';
import { useVBProjectedObject } from '@3d/hooks/useVBProjectedObject';
import { useVBProjection } from '@3d/hooks/useVBProjection';
import { useVectorBallStore } from '@3d/model/VectorBallStore';
import { createLogger } from '@helpers/log';
import { useObj } from '@hooks/useObj';
import { debugMsg2, debugMsg3, debugMsg } from './Debug/Debug';
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

  // const testVec = useSharedValue(0);
  // const testVec2 = useSharedValue([0]);
  // const testVec3 = useSharedValue({ x: 0 });

  const camera = useVBCamera();

  const screenObjects = useVectorBallStore({ length: 80 });

  const { projection } = useVBProjection({
    layout
  });

  const { gesture, props } = useQTrackballRotator({
    layout
  });

  const cubeObject = useVBProjectedObject({
    camera,
    projection,
    props,
    points: cube,
    screenObjects
  });

  // useAnimatedReaction(
  //   () => [testVec.value, testVec2.value, testVec3.value],
  //   ([value, value2, value3]) => {
  //     // const { x, y, z } = value3;
  //     // debugMsg.value = `${value.toFixed(2)}`;
  //     // debugMsg2.value = `${value2[0].toFixed(2)} ${value2[1].toFixed(2)} ${value2[2].toFixed(2)}`;
  //     // debugMsg3.value = `${x.toFixed(2)} ${y.toFixed(2)} ${z.toFixed(2)}`;
  //   }
  // );

  useEffect(() => {
    // cubeObject.rotationY.value = Math.PI / 2.5;
    cubeObject.rotationY.value = withRepeat(
      withTiming(Math.PI * 2, { duration: 4000, easing: Easing.linear }),
      -1,
      false
    );

    camera.pos.value = vec3.fromValues(0, 0, -50);
    camera.pos.value = withRepeat(
      withTiming(vec3.fromValues(0, 0, -10), {
        duration: 4000,
        easing: Easing.linear
      }),
      1,
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
          {screenObjects.map((obj, index) => (
            <VectorBall
              key={`vb-${index}`}
              image={image1}
              blurValue={obj.blur}
              size={obj.size}
              pos={obj.screenPos}
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
