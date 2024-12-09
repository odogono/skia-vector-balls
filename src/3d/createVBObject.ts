import { makeMutable } from 'react-native-reanimated';

import { vec3, vec4 } from '@3d/glMatrixWorklet';
import { VBObject } from './types';

export const createVBObject = (points: vec3[]): VBObject => {
  const points4 = points.map((point) =>
    vec4.fromValues(point[0], point[1], point[2], 1)
  );
  const screenPoints = points4.slice();
  const sizes = Array.from({ length: points.length }, () => 1);
  const blur = Array.from({ length: points.length }, () => 0);

  return {
    points: makeMutable(points4),
    screenPoints: makeMutable(screenPoints),
    sizes: makeMutable(sizes),
    blur: makeMutable(blur),
    rotationX: makeMutable(0),
    rotationY: makeMutable(0),
    rotationZ: makeMutable(0),
    translation: makeMutable(vec3.fromValues(0, 0, 0)),
    scale: makeMutable(vec3.fromValues(1, 1, 1))
  };
};
