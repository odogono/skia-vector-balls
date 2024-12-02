import { createMatrix4 } from '../matrix4';

describe('matrix4', () => {
  it('should create a matrix4', () => {
    const m = createMatrix4();
    expect(m).toEqual([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]);
  });
});
