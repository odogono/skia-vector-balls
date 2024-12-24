import {
  BlendColor,
  Blur,
  Group,
  Image,
  SkImage,
  Skia
} from '@shopify/react-native-skia';
import { useAnimatedReaction, useSharedValue } from 'react-native-reanimated';

import { vec3 } from '@3d/glMatrixWorklet';
import { createLog } from '@helpers/log';
import { Mutable } from '@types';

export type VectorBallProps = {
  image: SkImage | null;
  blurValue: Mutable<number>;
  size: Mutable<number>;
  pos: Mutable<vec3>;
};

export const VectorBall = ({
  image,
  blurValue,
  size,
  pos
}: VectorBallProps) => {
  const matrix = useSharedValue(Skia.Matrix());

  useAnimatedReaction(
    () => [pos.value, size.value] as [vec3, number],
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
      <BlendColor color='#00FF0077' mode='srcATop' />
      <Image image={image} fit='contain' width={size} height={size}>
        <Blur blur={blurValue} />
      </Image>
    </Group>
  );
};
