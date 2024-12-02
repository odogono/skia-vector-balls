import { makeMutable } from 'react-native-reanimated';

export type Mutable<T> = ReturnType<typeof makeMutable<T>>;

export type Position2 = [number, number];

export type Position3 = [number, number, number];

export type Position4 = [number, number, number, number];
