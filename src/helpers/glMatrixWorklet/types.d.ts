// export const ARRAY_TYPE = Array;

// export const glMatrix = {
//   ARRAY_TYPE
// };

interface IndexedCollection extends Iterable<number> {
  [index: number]: number;
  readonly length: number;
}

// prettier-ignore
declare type mat4 =
  | [number, number, number, number,
     number, number, number, number,
     number, number, number, number,
     number, number, number, number]
  | IndexedCollection;

declare type quat = [number, number, number, number] | IndexedCollection;
declare type vec2 = [number, number] | IndexedCollection;
declare type vec3 = [number, number, number] | IndexedCollection;
declare type vec4 = [number, number, number, number] | IndexedCollection;
