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
  SharedValue,
  runOnJS,
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { createLogger } from '@helpers/log';
import { Matrix4x4 } from '@helpers/matrix44';
import { project3d } from '@helpers/project3d';
import { Camera, Projection } from '@helpers/projection';
import { useObj } from '@hooks/useObj';
import { useVectorBallStore } from '@model/VectorBallStore';
import { Mutable, Position2, Position3 } from '@types';
import { VectorBall } from './VectorBall';
import { useProjectedObject, useProjection } from './useProjection';

const log = createLogger('VectorBalls');

export const VectorBalls = () => {
  const [layout, setLayout] = useState<{ width: number; height: number }>();
  const [viewMatrix, setViewMatrix] = useState<SkMatrix>();
  const image1 = useImage(require('@assets/images/sphere-a.png'));
  const cube = useObj('grid');

  const entities = useVectorBallStore({ length: 30 });

  const { projection } = useProjection({
    width: layout?.width ?? 0,
    height: layout?.height ?? 0
  });

  // useEffect(() => {
  //   log.debug('cube', cube);
  // }, []);

  const cubeObject = useProjectedObject(projection, cube, entities);

  // useEffect(() => {
  //   cubeObject.worldRotation.value = withRepeat(
  //     withTiming([Math.PI * 2, 0, 0], {
  //       duration: 8000
  //     }),
  //     -1,
  //     true
  //   );
  // }, [cubeObject]);

  useAnimatedReaction(
    () => cube,
    (cube) => {
      const count = cube.length;

      runOnJS(log.debug)(`cube length: ${count}`);
    }
  );

  // useEffect(() => {
  //   const width = layout?.width ?? 0;
  //   const height = layout?.height ?? 0;

  //   const camera: Camera = {
  //     position: [0, 0, 25],
  //     rotation: [0, 0, 0],
  //     fov: 90,
  //     aspectRatio: width / height,
  //     near: 0.1,
  //     far: 1000
  //   };

  //   // Create a world transform (rotation and translation)
  //   const worldRotation = Matrix4x4.rotationY(Math.PI / 1); // 45 degrees around Y axis
  //   const worldTranslation = Matrix4x4.translation(0, 0, 0); // Move 2 units along X axis
  //   const worldTransform = Matrix4x4.multiply(worldRotation, worldTranslation);
  //   // const worldTransform = new Matrix4x4();

  //   const projection = new Projection(camera, width, height);

  //   const projected = projection.projectPoints(cube, worldTransform);
  //   // log.debug('projected', projected);

  //   entities.forEach((entity, index) => {
  //     entity.screenPos.value = projected[index] ?? [0, 0, 0];
  //     entity.size.value = Math.max(0, 16 - (projected[index]?.[2] ?? 0)) * 2;
  //   });

  //   // const camera: Position3 = [0, 0, 10];
  //   // project3d({
  //   //   camera,
  //   //   points: cube,
  //   //   result: entities,
  //   //   screenWidth: layout?.width ?? 0,
  //   //   screenHeight: layout?.height ?? 0
  //   // });
  // }, [cube, entities, layout]);

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
