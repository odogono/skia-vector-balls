import { useEffect } from 'react';
import { View } from 'react-native';

import {
  Blur,
  Group,
  Image,
  Rect,
  SkImage,
  SkPoint,
  Skia,
  useImage
} from '@shopify/react-native-skia';
import {
  SharedValue,
  useAnimatedReaction,
  useSharedValue,
  withRepeat,
  withTiming
} from 'react-native-reanimated';

import { createLogger } from '@helpers/log';
import { useObj } from '@hooks/useObj';
import { useVectorBallStore } from '@model/VectorBallStore';
import { Mutable, Position2 } from '@types';
import { Canvas } from './Canvas';

const log = createLogger('VectorBalls');

export const VectorBalls = () => {
  const image1 = useImage(require('@assets/images/sphere-a.png'));
  // const cube = useObj('cube');
  const cube = useObj('cube');

  const entities = useVectorBallStore({ length: 10 });

  useEffect(() => {
    // blurValue.value = withRepeat(withTiming(10, { duration: 1000 }), -1, true);

    log.debug('cube', cube);
  }, []);

  return (
    <Canvas>
      {entities.map((entity, index) => (
        <VectorBall
          key={`vb-${index}`}
          image={image1}
          blurValue={entity.blur}
          size={entity.size}
          pos={entity.screenPos}
        />
      ))}
    </Canvas>
  );
};

type VectorBallProps = {
  image: SkImage | null;
  blurValue: Mutable<number>;
  size: Mutable<number>;
  pos: Mutable<Position2>;
};

const VectorBall = ({ image, blurValue, size, pos }: VectorBallProps) => {
  const matrix = useSharedValue(Skia.Matrix());

  useAnimatedReaction(
    () => [pos.value, size.value] as [Position2, number],
    ([pos, size]) => {
      matrix.modify((m) => {
        m.identity();
        m.translate(pos[0] - size / 2, pos[1] - size / 2);
        // m.scale(size, size);
        return m;
      });
    }
  );

  if (!image) return null;

  return (
    <Group matrix={matrix}>
      <Image image={image} fit='contain' width={size} height={size}>
        <Blur blur={blurValue} />
      </Image>
    </Group>
  );
};
