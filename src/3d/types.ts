import { vec3, vec4 } from '@3d/glMatrixWorklet';
import { Mutable } from '@types';

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
  rotationX: Mutable<number>;
  rotationY: Mutable<number>;
  rotationZ: Mutable<number>;
  translation: Mutable<vec3>;
  scale: Mutable<vec3>;
};

export type GLMProjection = {
  matrix: mat4;
  screenWidth: number;
  screenHeight: number;
};

export type VBCamera = {
  pos: Mutable<vec3>; // eye
  lookAt: Mutable<vec3>; // center
  up: Mutable<vec3>;
  matrix: Mutable<mat4>;
};
