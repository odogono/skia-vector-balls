import { useEffect, useMemo, useState } from 'react';
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
import { createLog } from '@helpers/log';
import { useObj } from '@hooks/useObj';
import { useViewDims } from '@hooks/useViewDims';
import { createVBObject } from '../3d/createVBObject';
import { createVector3 } from '../3d/vector3';
import { debugMsg2, debugMsg3, debugMsg } from './Debug/Debug';
import { VectorBall } from './VectorBall';

const log = createLog('VectorBalls');

export const VectorBalls = () => {
  const { areViewDimsValid, viewDims, setViewDims } = useViewDims();
  const [viewMatrix, setViewMatrix] = useState<SkMatrix>();
  const image1 = useImage(require('@assets/images/sphere-a.png'));

  // const cube = useObj('tree');

  const object = useMemo(() => createCube(), []);

  const camera = useVBCamera();

  const screenObjects = useVectorBallStore({ length: 80 });

  const { projection } = useVBProjection({
    viewDims
  });

  const { gesture, props } = useQTrackballRotator({
    viewDims
  });

  useVBProjectedObject({
    areViewDimsValid,
    object,
    camera,
    projection,
    props,
    screenObjects
  });

  // object.rotation.value = withRepeat(
  useEffect(() => {
    // object.rotation.value = withRepeat(
    //   withTiming(createVector3(0, Math.PI * 2, Math.PI * 2), {
    //     duration: 4000,
    //     easing: Easing.linear
    //   }),
    //   -1,
    //   false
    // );
    // object.rotation.value = createVector3(0, 0.1, 0);

    camera.pos.value = createVector3(0, 0, -10);

    camera.pos.value = createVector3(0, 0, -10);
    // camera.pos.value = createVector3(0, 0, -50);
    // camera.pos.value = withRepeat(
    //   withTiming(createVector3(0, 0, -10), {
    //     duration: 4000,
    //     easing: Easing.linear
    //   }),
    //   1,
    //   false
    // );

    object.scale.value = createVector3(3, 3, 3);
    object.translation.value = createVector3(0, 0, 15);
    // object.translation.value = withRepeat(
    //   withTiming(createVector3(0, 0, 5), {
    //     duration: 2000
    //     // easing: Easing.linear
    //   }),
    //   -1,
    //   true
    // );
  }, [object]);

  return (
    <GestureDetector gesture={gesture}>
      <SkiaCanvas
        style={styles.canvas}
        onLayout={(event) => {
          setViewDims(event.nativeEvent.layout);
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

const createCube = () => {
  const points = [
    vec3.fromValues(1, 1, -1),
    vec3.fromValues(1, -1, -1),
    vec3.fromValues(1, 1, 1),
    vec3.fromValues(1, -1, 1),
    vec3.fromValues(-1, 1, -1),
    vec3.fromValues(-1, -1, -1),
    vec3.fromValues(-1, 1, 1),
    vec3.fromValues(-1, -1, 1)
  ];

  const result = createVBObject(points);

  return result!;
};
