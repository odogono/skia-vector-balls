import { Position3 } from '../types';

// parts gratefully borrowed from https://github.com/mrdoob/three.js/blob/dev/src/math/Matrix4.js

export type Matrix4 = number[];

export const createMatrix4 = (): Matrix4 => {
  return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
};

export const setMatrix4 = (
  m: Matrix4,
  n11: number = 1,
  n12: number = 0,
  n13: number = 0,
  n14: number = 0,
  n21: number = 0,
  n22: number = 1,
  n23: number = 0,
  n24: number = 0,
  n31: number = 0,
  n32: number = 0,
  n33: number = 1,
  n34: number = 0,
  n41: number = 0,
  n42: number = 0,
  n43: number = 0,
  n44: number = 1
): Matrix4 => {
  m[0] = n11;
  m[4] = n12;
  m[8] = n13;
  m[12] = n14;

  m[1] = n21;
  m[5] = n22;
  m[9] = n23;
  m[13] = n24;

  m[2] = n31;
  m[6] = n32;
  m[10] = n33;
  m[14] = n34;

  m[3] = n41;
  m[7] = n42;
  m[11] = n43;
  m[15] = n44;

  return m;
};

export const identityMatrix4 = (m: Matrix4): Matrix4 => setMatrix4(m);

export const multiplyMatrix4 = (m: Matrix4, a: Matrix4, b: Matrix4) => {
  const [
    a11,
    a12,
    a13,
    a14,
    a21,
    a22,
    a23,
    a24,
    a31,
    a32,
    a33,
    a34,
    a41,
    a42,
    a43,
    a44
  ] = a;
  const [
    b11,
    b12,
    b13,
    b14,
    b21,
    b22,
    b23,
    b24,
    b31,
    b32,
    b33,
    b34,
    b41,
    b42,
    b43,
    b44
  ] = b;

  m[0] = a11 * b11 + a12 * b21 + a13 * b31 + a14 * b41;
  m[1] = a11 * b12 + a12 * b22 + a13 * b32 + a14 * b42;
  m[2] = a11 * b13 + a12 * b23 + a13 * b33 + a14 * b43;
  m[3] = a11 * b14 + a12 * b24 + a13 * b34 + a14 * b44;

  m[4] = a21 * b11 + a22 * b21 + a23 * b31 + a24 * b41;
  m[5] = a21 * b12 + a22 * b22 + a23 * b32 + a24 * b42;
  m[6] = a21 * b13 + a22 * b23 + a23 * b33 + a24 * b43;
  m[7] = a21 * b14 + a22 * b24 + a23 * b34 + a24 * b44;

  m[8] = a31 * b11 + a32 * b21 + a33 * b31 + a34 * b41;
  m[9] = a31 * b12 + a32 * b22 + a33 * b32 + a34 * b42;
  m[10] = a31 * b13 + a32 * b23 + a33 * b33 + a34 * b43;
  m[11] = a31 * b14 + a32 * b24 + a33 * b34 + a34 * b44;

  m[12] = a41 * b11 + a42 * b21 + a43 * b31 + a44 * b41;
  m[13] = a41 * b12 + a42 * b22 + a43 * b32 + a44 * b42;
  m[14] = a41 * b13 + a42 * b23 + a43 * b33 + a44 * b43;
  m[15] = a41 * b14 + a42 * b24 + a43 * b34 + a44 * b44;

  return m;
};

export const multiplyMatrix4Create = (a: Matrix4, b: Matrix4): Matrix4 => {
  const m = createMatrix4();
  return multiplyMatrix4(m, a, b);
};

export const translateMatrix4 = (matrix: Matrix4, pos: Position3): Matrix4 => {
  matrix[12] = pos[0];
  matrix[13] = pos[1];
  matrix[14] = pos[2];
  return matrix;
};

export const rotateXMatrix4 = (matrix: Matrix4, theta: number): Matrix4 => {
  const c = Math.cos(theta);
  const s = Math.sin(theta);

  matrix[5] = c;
  matrix[6] = -s;
  matrix[9] = s;
  matrix[10] = c;

  return matrix;
};

export const rotateYMatrix4 = (matrix: Matrix4, theta: number): Matrix4 => {
  const c = Math.cos(theta);
  const s = Math.sin(theta);

  matrix[0] = c;
  matrix[2] = s;
  matrix[8] = -s;
  matrix[10] = c;

  return matrix;
};

export const rotateZMatrix4 = (matrix: Matrix4, theta: number): Matrix4 => {
  const c = Math.cos(theta);
  const s = Math.sin(theta);

  matrix[0] = c;
  matrix[1] = -s;
  matrix[4] = s;
  matrix[5] = c;

  return matrix;
};

export const transformPosition3 = (
  matrix: Matrix4,
  pos: Position3
): Position3 => {
  const result = [0, 0, 0, 0];

  result[0] =
    pos[0] * matrix[0] + pos[1] * matrix[4] + pos[2] * matrix[8] + matrix[12];
  result[1] =
    pos[0] * matrix[1] + pos[1] * matrix[5] + pos[2] * matrix[9] + matrix[13];
  result[2] =
    pos[0] * matrix[2] + pos[1] * matrix[6] + pos[2] * matrix[10] + matrix[14];
  result[3] =
    pos[0] * matrix[3] + pos[1] * matrix[7] + pos[2] * matrix[11] + matrix[15];

  return result;
};
