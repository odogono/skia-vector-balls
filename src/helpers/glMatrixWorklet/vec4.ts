/**
 * Creates a new vec4 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @param {Number} w W component
 * @returns {vec4} a new 4D vector
 */
export const fromValues = (
  x: number,
  y: number,
  z: number,
  w: number
): vec4 => {
  'worklet';

  return [x, y, z, w] as vec4;

  // const out = Array(4).fill(0) as vec4;
  // out[0] = x;
  // out[1] = y;
  // out[2] = z;
  // out[3] = w;
  // return out;
};

/**
 * Transforms the vec4 with a mat4.
 *
 * @param {vec4} out the receiving vector
 * @param {ReadonlyVec4} a the vector to transform
 * @param {ReadonlyMat4} m matrix to transform with
 * @returns {vec4} out
 */
export const transformMat4 = (out: vec4, a: vec4, m: mat4): vec4 => {
  'worklet';

  const x = a[0];
  const y = a[1];
  const z = a[2];
  const w = a[3];
  out[0] = m[0] * x + m[4] * y + m[8] * z + m[12] * w;
  out[1] = m[1] * x + m[5] * y + m[9] * z + m[13] * w;
  out[2] = m[2] * x + m[6] * y + m[10] * z + m[14] * w;
  out[3] = m[3] * x + m[7] * y + m[11] * z + m[15] * w;
  return out;
};
