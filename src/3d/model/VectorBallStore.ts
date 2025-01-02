import { useMemo } from 'react';

import { makeMutable } from 'react-native-reanimated';

import { vec3, vec4 } from '@3d/glMatrixWorklet';
import { VBScreenObject } from '@3d/types';

export const createVBScreenObject = (): VBScreenObject => {
  return {
    pos: makeMutable(vec3.create()),
    size: makeMutable(0),
    screenPos: makeMutable(vec3.create()),
    blur: makeMutable(0),
    color: makeMutable(vec4.fromValues(0, 1, 0, 0.6))
  };
};

export type UseVectorBallStoreProps = {
  length: number;
};

export const useVectorBallStore = ({ length }: UseVectorBallStoreProps) => {
  return useMemo(
    () => Array.from({ length }, () => createVBScreenObject()),
    [length]
  );
};
