/**
 * 3 Dimensional Vector
 * @module vec3
 */

/**
 * Creates a new, empty vec3
 *
 * @returns {vec3} a new 3D vector
 */
export const create = (): vec3 => {
  'worklet';
  return [0, 0, 0];
};

/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
export const fromValues = (
  x: number = 0,
  y: number = 0,
  z: number = 0
): vec3 => {
  'worklet';
  return [x, y, z];
};

/**
 * Calculates the length of a vec3
 *
 * @param {ReadonlyVec3} a vector to calculate length of
 * @returns {Number} length of a
 */
export const length = (a: vec3): number => {
  'worklet';
  const x = a[0];
  const y = a[1];
  const z = a[2];
  return Math.sqrt(x * x + y * y + z * z);
};

/**
 * Normalize a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to normalize
 * @returns {vec3} out
 */
export const normalize = (out: vec3, a: vec3): vec3 => {
  'worklet';
  const x = a[0];
  const y = a[1];
  const z = a[2];
  let len = x * x + y * y + z * z;
  if (len > 0) {
    //TODO: evaluate use of glm_invsqrt here?
    len = 1 / Math.sqrt(len);
  }

  out[0] = a[0] * len;
  out[1] = a[1] * len;
  out[2] = a[2] * len;
  return out;
};

/**
 * Negates the components of a vec3
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a vector to negate
 * @returns {vec3} out
 */
export const negate = (out: vec3, a: vec3): vec3 => {
  'worklet';
  out[0] = -a[0];
  out[1] = -a[1];
  out[2] = -a[2];
  return out;
};

/**
 * Copy the values from one vec3 to another
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the source vector
 * @returns {vec3} out
 */
export const copy = (out: vec3, a: vec3): vec3 => {
  'worklet';
  out[0] = a[0];
  out[1] = a[1];
  out[2] = a[2];
  return out;
};

/**
 * Scales a vec3 by a scalar number
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the vector to scale
 * @param {Number} b amount to scale the vector by
 * @returns {vec3} out
 */
export const scale = (out: vec3, a: vec3, b: number): vec3 => {
  'worklet';
  out[0] = a[0] * b;
  out[1] = a[1] * b;
  out[2] = a[2] * b;
  return out;
};

/**
 * Calculates the dot product of two vec3's
 *
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {Number} dot product of a and b
 */
export const dot = (a: vec3, b: vec3): number => {
  'worklet';
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
};

/**
 * Adds two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
export const add = (out: vec3, a: vec3, b: vec3): vec3 => {
  'worklet';
  out[0] = a[0] + b[0];
  out[1] = a[1] + b[1];
  out[2] = a[2] + b[2];
  return out;
};

/**
 * Subtracts vector b from vector a
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
export const subtract = (out: vec3, a: vec3, b: vec3): vec3 => {
  'worklet';
  out[0] = a[0] - b[0];
  out[1] = a[1] - b[1];
  out[2] = a[2] - b[2];
  return out;
};

/**
 * Computes the cross product of two vec3's
 *
 * @param {vec3} out the receiving vector
 * @param {ReadonlyVec3} a the first operand
 * @param {ReadonlyVec3} b the second operand
 * @returns {vec3} out
 */
export const cross = (out: vec3, a: vec3, b: vec3): vec3 => {
  'worklet';
  const ax = a[0],
    ay = a[1],
    az = a[2];
  const bx = b[0],
    by = b[1],
    bz = b[2];

  out[0] = ay * bz - az * by;
  out[1] = az * bx - ax * bz;
  out[2] = ax * by - ay * bx;
  return out;
};

/**
 * Reflect a vector in the direction of an axis
 *
 * @param {vec3} axis the axis to reflect in
 * @param {vec3} source the vector to reflect
 * @param {vec3} destination the receiving vector
 * @returns {vec3} destination
 */
export const reflectInAxis = (
  axis: vec3,
  source: vec3,
  destination: vec3
): vec3 => {
  'worklet';
  const s =
    2 * (axis[0] * source[0] + axis[1] * source[1] + axis[2] * source[2]);
  destination[0] = s * axis[0] - source[0];
  destination[1] = s * axis[1] - source[1];
  destination[2] = s * axis[2] - source[2];

  return destination;
};
