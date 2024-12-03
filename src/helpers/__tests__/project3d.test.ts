import {
  createCamera,
  createObject3,
  createProjection,
  projectObject3,
  updateProjectionMatrix,
  updateViewMatrix
} from '@components/useProjection';
import { Entity, createEntity } from '@model/VectorBallStore';
import { Position3 } from '@types';
import { Camera } from '../projection';

describe('project3d', () => {
  it('should project points', () => {
    const screenWidth = 600;
    const screenHeight = 400;
    const points: Position3[] = [
      [0, 0, 0],
      [1, 1, 1],
      [2, 2, 2]
    ];
    const object = createObject3(points);
    const result: Entity[] = Array.from({ length: 10 }, () => createEntity());
    const camera: Camera = createCamera(screenWidth, screenHeight);
    const projection = createProjection(camera, screenWidth, screenHeight);
    updateProjectionMatrix(projection);
    updateViewMatrix(projection);

    projectObject3(projection, object, result);

    const screenPositions = result.map((entity) => entity.screenPos.value);

    // console.log(screenPositions);

    expect(screenPositions).toEqual([
      [509.91062095798765, -9.910620957987604, 4.78313043478261],
      [400.58217254236905, 99.4178274576309, 4.7921875],
      [300, 200, 4.800520000000001],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0],
      [0, 0, 0]
    ]);
  });
});
