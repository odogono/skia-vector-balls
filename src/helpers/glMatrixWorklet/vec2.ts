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
