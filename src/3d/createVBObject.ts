import { makeMutable } from 'react-native-reanimated';

import { vec3, vec4 } from '@3d/glMatrixWorklet';
import { VBObject } from './types';
import { createVector3 } from './vector3';

export const createVBObject = (
  points?: vec3[],
  colors?: vec4[]
): VBObject | undefined => {
  if (!points) {
    return undefined;
  }
  const points4 = points.map((point) =>
    vec4.fromValues(point[0], point[1], point[2], 1)
  );
  const screenPoints = points4.slice();
  const sizes = Array.from({ length: points.length }, () => 1);
  const blur = Array.from({ length: points.length }, () => 0);
  const colorsArray =
    colors ??
    Array.from({ length: points.length }, () => vec4.fromValues(0, 1, 0, 0.6));

  return {
    points: makeMutable(points4),
    screenPoints: makeMutable(screenPoints),
    sizes: makeMutable(sizes),
    blur: makeMutable(blur),
    colors: makeMutable(colorsArray),
    translation: makeMutable(createVector3(0, 0, 0)),
    scale: makeMutable(createVector3(1, 1, 1)),
    rotation: makeMutable(createVector3(0, 0, 0))
  };
};
