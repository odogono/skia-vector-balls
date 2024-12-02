import { Position3, Position4 } from '@types';

export type Matrix4x4D = {
  data: number[][];
};

export const createMatrix4x4 = (): Matrix4x4D => {
  'worklet';
  return {
    data: [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ]
  };
};

export const identityMatrix4x4 = (m: Matrix4x4D): Matrix4x4D => {
  'worklet';
  m.data = [
    [1, 0, 0, 0],
    [0, 1, 0, 0],
    [0, 0, 1, 0],
    [0, 0, 0, 1]
  ];
  return m;
};

export const copyMatrix4x4 = (m: Matrix4x4D): Matrix4x4D => {
  'worklet';
  return {
    data: m.data.map((row) => row.slice())
  };
};

export const multiplyMatrix4x4 = (
  m: Matrix4x4D,
  a: Matrix4x4D,
  b: Matrix4x4D
): Matrix4x4D => {
  'worklet';

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      m.data[i][j] = 0;
      for (let k = 0; k < 4; k++) {
        m.data[i][j] += a.data[i][k] * b.data[k][j];
      }
    }
  }

  return m;
};

export const translateMatrix4x4 = (
  m: Matrix4x4D,
  x: number,
  y: number,
  z: number
): Matrix4x4D => {
  'worklet';
  m.data[0][3] = x;
  m.data[1][3] = y;
  m.data[2][3] = z;

  return m;
};

export const rotationXMatrix4x4 = (
  m: Matrix4x4D,
  angle: number
): Matrix4x4D => {
  'worklet';
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  m.data[1][1] = cos;
  m.data[1][2] = -sin;
  m.data[2][1] = sin;
  m.data[2][2] = cos;

  return m;
};

export const rotationYMatrix4x4 = (
  m: Matrix4x4D,
  angle: number
): Matrix4x4D => {
  'worklet';

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  m.data[0][0] = cos;
  m.data[0][2] = sin;
  m.data[2][0] = -sin;
  m.data[2][2] = cos;

  return m;
};

export const rotationZMatrix4x4 = (
  m: Matrix4x4D,
  angle: number
): Matrix4x4D => {
  'worklet';

  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  m.data[0][0] = cos;
  m.data[0][1] = -sin;
  m.data[1][0] = sin;
  m.data[1][1] = cos;

  return m;
};

/**
 * Transforms an array of 3D points using a 4x4 matrix
 *
 * @param points - Array of input points to transform
 * @param results - Array to store transformed points (must be same length as points)
 * @param m - 4x4 transformation matrix
 * @returns The results array containing transformed points
 */
export const transformPointsMatrix4x4 = (
  m: Matrix4x4D,
  points: Position4[],
  results: Position4[]
): Position4[] => {
  'worklet';

  const vec = [0, 0, 0, 1];
  const out = [0, 0, 0, 0];

  for (let p = 0; p < points.length; p++) {
    const point = points[p];
    const result = results[p];

    // Set up input vector
    vec[0] = point[0];
    vec[1] = point[1];
    vec[2] = point[2];

    // Reset output vector
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;

    // Matrix multiplication
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        out[i] += m.data[i][j] * vec[j];
      }
    }

    // Perspective divide and store result
    result[0] = out[0] / out[3];
    result[1] = out[1] / out[3];
    result[2] = out[2] / out[3];
  }

  return results;
};

// Keep the original single-point version for reference
export const transformPointMatrix4x4 = (
  point: Position3,
  result: Position3,
  m: Matrix4x4D
): Position3 => {
  'worklet';

  const vec = [point[0], point[1], point[2], 1];
  const out = [0, 0, 0, 0];

  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[i] += m.data[i][j] * vec[j];
    }
  }

  result[0] = out[0] / out[3];
  result[1] = out[1] / out[3];
  result[2] = out[2] / out[3];

  return result;
};

export class Matrix4x4 {
  data: number[][];

  constructor() {
    // Initialize as identity matrix
    this.data = [
      [1, 0, 0, 0],
      [0, 1, 0, 0],
      [0, 0, 1, 0],
      [0, 0, 0, 1]
    ];
  }

  public static multiply(a: Matrix4x4, b: Matrix4x4): Matrix4x4 {
    const result = new Matrix4x4();
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result.data[i][j] = 0;
        for (let k = 0; k < 4; k++) {
          result.data[i][j] += a.data[i][k] * b.data[k][j];
        }
      }
    }
    return result;
  }

  public static rotationX(angle: number): Matrix4x4 {
    const matrix = new Matrix4x4();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    matrix.data[1][1] = cos;
    matrix.data[1][2] = -sin;
    matrix.data[2][1] = sin;
    matrix.data[2][2] = cos;

    return matrix;
  }

  public static rotationY(angle: number): Matrix4x4 {
    const matrix = new Matrix4x4();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    matrix.data[0][0] = cos;
    matrix.data[0][2] = sin;
    matrix.data[2][0] = -sin;
    matrix.data[2][2] = cos;

    return matrix;
  }

  public static rotationZ(angle: number): Matrix4x4 {
    const matrix = new Matrix4x4();
    const cos = Math.cos(angle);
    const sin = Math.sin(angle);

    matrix.data[0][0] = cos;
    matrix.data[0][1] = -sin;
    matrix.data[1][0] = sin;
    matrix.data[1][1] = cos;

    return matrix;
  }

  public static translation(x: number, y: number, z: number): Matrix4x4 {
    const matrix = new Matrix4x4();
    matrix.data[0][3] = x;
    matrix.data[1][3] = y;
    matrix.data[2][3] = z;
    return matrix;
  }

  public transformPoint(point: Position3): Position3 {
    const vec = [point[0], point[1], point[2], 1];
    const result = [0, 0, 0, 0];

    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        result[i] += this.data[i][j] * vec[j];
      }
    }

    return [
      result[0] / result[3],
      result[1] / result[3],
      result[2] / result[3]
    ];
  }

  public transformPoints(points: Position3[]): Position3[] {
    return points.map(this.transformPoint);
  }
}
