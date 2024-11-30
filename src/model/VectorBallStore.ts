import { useState } from 'react';

import { makeMutable } from 'react-native-reanimated';

import { Mutable, Position2, Position3 } from '@types';

type Entity = {
  pos: Mutable<Position3>;
  screenPos: Mutable<Position2>;
  size: Mutable<number>;
  blur: Mutable<number>;
};

const createEntity = (): Entity => {
  return {
    pos: makeMutable([0, 0, 0]),
    size: makeMutable(8),
    screenPos: makeMutable([0, 0]),
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
