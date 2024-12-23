import { vec3 } from '@3d/glMatrixWorklet';
import { Vector3 } from '@types';

export const createVector3 = (x: number, y: number, z: number): Vector3 => {
  return { x, y, z };
};

export const vec3FromVector3 = (vector3: Vector3): vec3 => {
  'worklet';
  return vec3.fromValues(vector3.x, vector3.y, vector3.z);
};
