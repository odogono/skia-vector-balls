/**
 * 2 Dimensional Vector
 * @module vec2
 */

/**
 * Creates a new, empty vec2
 *
 * @returns {vec2} a new 2D vector
 */
export const create = (): vec2 => {
  'worklet';
  return [0, 0];
};

/**
 * Creates a new vec2 initialized with the given values
 *
 * @param {Number} x X component
 * @param {Number} y Y component
 * @returns {vec2} a new 2D vector
 */
export const fromValues = (x: number, y: number): vec2 => {
  'worklet';
  return [x, y];
};
