import { makeMutable } from 'react-native-reanimated';

export type Mutable<T> = ReturnType<typeof makeMutable<T>>;

export type Position2 = [number, number];

export type Position3 = [number, number, number];

export type Position4 = [number, number, number, number];

export type Vector2 = {
  x: number;
  y: number;
};

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};
