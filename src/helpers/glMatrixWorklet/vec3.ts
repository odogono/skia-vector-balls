/**
 * Creates a new vec3 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @param {Number} z Z component
 * @returns {vec3} a new 3D vector
 */
export const fromValues = (x: number, y: number, z: number): vec3 => {
  'worklet';
  return [x, y, z];
};
