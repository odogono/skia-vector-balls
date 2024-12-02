import { useEffect } from 'react';

import {
  Blur,
  Group,
  Image,
  SkImage,
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
import { Mutable, Position2, Position3 } from '@types';

export type VectorBallProps = {
  image: SkImage | null;
  blurValue: Mutable<number>;
  size: Mutable<number>;
  pos: Mutable<Position3>;
};

export const VectorBall = ({
  image,
  blurValue,
  size,
  pos
}: VectorBallProps) => {
  const matrix = useSharedValue(Skia.Matrix());

  useAnimatedReaction(
    () => [pos.value, size.value] as [Position3, number],
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
