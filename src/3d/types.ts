import { vec3, vec4 } from '@3d/glMatrixWorklet';
import { Mutable, Vector3 } from '@types';

export type VBScreenObject = {
  pos: Mutable<vec3>;
  screenPos: Mutable<vec3>; // x, y, depth
  size: Mutable<number>;
  blur: Mutable<number>;
};

export type VBObject = {
  points: Mutable<vec4[]>;
  screenPoints: Mutable<vec4[]>;
  sizes: Mutable<number[]>;
  blur: Mutable<number[]>;
  rotation: Mutable<Vector3>;
  rotationX: Mutable<number>;
  rotationY: Mutable<number>;
  rotationZ: Mutable<number>;
  translation: Mutable<Vector3>;
  scale: Mutable<Vector3>;
};

export type GLMProjection = {
  matrix: mat4;
  screenWidth: number;
  screenHeight: number;
};

export type VBCamera = {
  pos: Mutable<Vector3>; // eye
  lookAt: Mutable<Vector3>; // center
  up: Mutable<Vector3>;
  matrix: Mutable<mat4>;
};
