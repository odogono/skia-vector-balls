import { SkMatrix } from '@shopify/react-native-skia';

import { createLogger } from '@helpers/log';
import { Entity } from '@model/VectorBallStore';
import { Position3 } from '@types';

const log = createLogger('project3d');

export const createProjectionMatrix = (
  width: number,
  height: number,
  fov: number = 90,
  near: number = 0.1,
  far: number = 1000
) => {
  const aspectRatio = width / height;
  const fovRad = (fov * Math.PI) / 180;
  const f = 1.0 / Math.tan(fovRad / 2);
  const rangeInv = 1 / (near - far);

  return [
    [f / aspectRatio, 0, 0, 0],
    [0, f, 0, 0],
    [0, 0, (near + far) * rangeInv, -1],
    [0, 0, near * far * rangeInv * 2, 0]
  ];
};

const multiplyMatrixVector = (
  point: Position3,
  camera: Position3,
  projectionMatrix: number[][]
): Position3 => {
  const x = point[0] - camera[0];
  const y = point[1] - camera[1];
  const z = point[2] - camera[2];
  const w = -(z * projectionMatrix[3][2]);

  return [
    x * projectionMatrix[0][0],
    y * projectionMatrix[1][1],
    z * projectionMatrix[2][2] + w
  ];
};

export const project = (
  point: Position3,
  camera: Position3,
  projectionMatrix: number[][],
  screenWidth: number,
  screenHeight: number
): Position3 | null => {
  const projected = multiplyMatrixVector(point, camera, projectionMatrix);

  if (projected[2] <= 0) {
    log.debug('projected[2] <= 0', projected[2]);
    return null;
  }

  const x = projected[0] / projected[2];
  const y = projected[1] / projected[2];

  return [
    (x + 1) * 0.5 * screenWidth,
    (1 - (y + 1) * 0.5) * screenHeight,
    projected[2]
  ];
};

export type Project3dProps = {
  camera: Position3;
  points: Position3[];
  result: Entity[];
  screenWidth: number;
  screenHeight: number;
};

export const project3d = ({
  camera,
  points,
  result,
  screenWidth,
  screenHeight
}: Project3dProps) => {
  const projectionMatrix = createProjectionMatrix(screenWidth, screenHeight);

  points.forEach((point, index) => {
    const screenPos = project(
      point,
      camera,
      projectionMatrix,
      screenWidth,
      screenHeight
    );

    log.debug('screenPos', screenPos);

    if (!screenPos) {
      result[index].size.value = 0;
    } else {
      result[index].screenPos.value = screenPos;
      result[index].size.value = Math.max(0, 16 - screenPos[2]) * 2;
    }
  });

  return result;
};
