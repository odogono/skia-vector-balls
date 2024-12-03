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

declare type vec2 = [number, number] | IndexedCollection;
declare type vec3 = [number, number, number] | IndexedCollection;
declare type vec4 = [number, number, number, number] | IndexedCollection;

// // prettier-ignore
// export type mat4 =
//   | [number, number, number, number,
//      number, number, number, number,
//      number, number, number, number,
//      number, number, number, number];

// export type vec2 = [number, number];
// export type vec3 = [number, number, number];
// export type vec4 = [number, number, number, number];
