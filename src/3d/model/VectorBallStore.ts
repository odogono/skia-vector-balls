import { useState } from 'react';

import { makeMutable } from 'react-native-reanimated';

import { vec3 } from '@3d/glMatrixWorklet';
import { Mutable } from '@types';

export type Entity = {
  pos: Mutable<vec3>;
  screenPos: Mutable<vec3>; // x, y, depth
  size: Mutable<number>;
  blur: Mutable<number>;
};

export const createEntity = (): Entity => {
  return {
    pos: makeMutable(vec3.create()),
    size: makeMutable(0),
    screenPos: makeMutable(vec3.create()),
    blur: makeMutable(0)
  };
};

export type UseVectorBallStoreProps = {
  length: number;
};

export const useVectorBallStore = ({ length }: UseVectorBallStoreProps) => {
  const [entities] = useState<Entity[]>(() => {
    return Array.from({ length }, () => createEntity());
  });

  return entities;
};
