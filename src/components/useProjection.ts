import { useMemo, useState } from 'react';

import {
  makeMutable,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue,
  type DerivedValue
} from 'react-native-reanimated';

import { createLogger } from '@helpers/log';
import {
  Matrix4x4,
  Matrix4x4D,
  createMatrix4x4,
  identityMatrix4x4,
  multiplyMatrix4x4,
  rotationXMatrix4x4,
  rotationYMatrix4x4,
  rotationZMatrix4x4,
  transformPointMatrix4x4,
  transformPointsMatrix4x4,
  translateMatrix4x4
} from '@helpers/matrix44';
import { Camera, Projection } from '@helpers/projection';
import { Mutable, Position3, Position4 } from '@types';
import { Entity } from '../model/VectorBallStore';

const log = createLogger('useProjection');

export type Object3 = {
  points: Mutable<Position4[]>;

  screenPoints: Mutable<Position4[]>;

  sizes: Mutable<number[]>;

  blur: Mutable<number[]>;

  worldRotation: Mutable<Position3>;

  worldTranslation: Mutable<Position3>;

  worldTransform: Mutable<Matrix4x4D>;

  count: number;
};

export const createObject3 = (input: Position3[]): Object3 => {
  const points = input.map((point) => [
    point[0],
    point[1],
    point[2],
    1
  ]) as Position4[];
  const screenPoints = points.slice();
  const sizes = Array.from({ length: points.length }, () => 1);
  const blur = Array.from({ length: points.length }, () => 0);

  return {
    points: makeMutable(points),
    screenPoints: makeMutable(screenPoints),
    sizes: makeMutable(sizes),
    blur: makeMutable(blur),
    worldRotation: makeMutable([0, 0, 0]),
    worldTranslation: makeMutable([0, 0, 0]),
    worldTransform: makeMutable(createMatrix4x4()),
    count: points.length
  };
};

export const createCamera = (width: number, height: number): Camera => {
  return {
    position: [0, 0, 25],
    rotation: [0, 0, 0],
    fov: 45,
    aspectRatio: width / height,
    near: 0.1,
    far: 1000
  };
};

type Projection3 = {
  camera: Camera;
  screenWidth: number;
  screenHeight: number;
  projectionMatrix: Matrix4x4D;
  viewMatrix: Matrix4x4D;
  tempMatrix: Matrix4x4D;
  tempMatrix2: Matrix4x4D;
  tempMatrix3: Matrix4x4D;
};

export const createProjection = (
  camera: Camera,
  width: number,
  height: number
): Projection3 => {
  'worklet';
  return {
    camera,
    screenWidth: width,
    screenHeight: height,
    projectionMatrix: createMatrix4x4(),
    viewMatrix: createMatrix4x4(),
    tempMatrix: createMatrix4x4(),
    tempMatrix2: createMatrix4x4(),
    tempMatrix3: createMatrix4x4()
  };
};

export const updateProjectionMatrix = (projection: Projection3) => {
  'worklet';

  const { fov, near, far, aspectRatio } = projection.camera;

  const fovRad = (fov * Math.PI) / 180;
  const f = 1.0 / Math.tan(fovRad / 2);
  const rangeInv = 1 / (near - far);

  projection.projectionMatrix.data = [
    [f / aspectRatio, 0, 0, 0],
    [0, f, 0, 0],
    [0, 0, (near + far) * rangeInv, -1],
    [0, 0, near * far * rangeInv * 2, 0]
  ];
};

export const updateViewMatrix = (projection: Projection3) => {
  'worklet';

  const { tempMatrix, tempMatrix2, tempMatrix3, viewMatrix, camera } =
    projection;
  const { rotation } = camera;

  rotationXMatrix4x4(tempMatrix, rotation[0]);
  rotationYMatrix4x4(tempMatrix2, rotation[1]);

  // xy rotation
  multiplyMatrix4x4(tempMatrix3, tempMatrix, tempMatrix2);

  // z rotation
  rotationZMatrix4x4(tempMatrix2, rotation[2]);

  // rotation matrix
  multiplyMatrix4x4(tempMatrix, tempMatrix3, tempMatrix2);

  // translation matrix
  translateMatrix4x4(
    tempMatrix2,
    -camera.position[0],
    -camera.position[1],
    -camera.position[2]
  );

  // runOnJS(log.debug)('updateViewMatrix camera', camera.position);
  // runOnJS(log.debug)('updateViewMatrix tempMatrix', tempMatrix2);

  // view = rotation * translation
  multiplyMatrix4x4(viewMatrix, tempMatrix, tempMatrix2);

  return projection;
};

export const projectObject3 = (
  projection: Projection3,
  object: Object3,
  entities: Entity[]
) => {
  'worklet';

  const { points, worldTransform, screenPoints } = object;
  const { viewMatrix, projectionMatrix, screenWidth, screenHeight } =
    projection;

  // runOnJS(log.debug)('projectObject3', points.value);

  // apply world transform
  transformPointsMatrix4x4(
    worldTransform.value,
    points.value,
    screenPoints.value
  );

  // runOnJS(log.debug)('projectObject3 viewMatrix', viewMatrix);

  // apply view transform
  transformPointsMatrix4x4(viewMatrix, screenPoints.value, screenPoints.value);

  // apply projection transform
  transformPointsMatrix4x4(
    projectionMatrix,
    screenPoints.value,
    screenPoints.value
  );

  const scrPoints = screenPoints.value;
  // runOnJS(log.debug)('projectObject3 result', scrPoints);

  for (let i = 0; i < scrPoints.length; i++) {
    const point = scrPoints[i];
    // discard if point is behind camera
    if (point[2] <= 0) {
      point[3] = -1;
    } else {
      // convert to screen coordinates
      // runOnJS(log.debug)('p', point[0], point[1], 0.5 * screenWidth);
      point[0] = (point[0] + 1) * 0.5 * screenWidth;
      point[1] = (1 - (point[1] + 1) * 0.5) * screenHeight;
      // runOnJS(log.debug)('p=', point[0], point[1]);
      point[3] = 1;
    }
  }

  // sort the scrPoints by z
  scrPoints.sort((a, b) => a[2] - b[2]);

  if (entities) {
    for (let i = 0; i < entities.length; i++) {
      const point = scrPoints[i];
      if (!point) {
        continue;
      }
      const entity = entities[i];
      if (!entity) {
        continue;
      }
      entity.screenPos.value = [point[0], point[1], point[2]];
      entity.size.value = (point[2] - 5) * 192; // Math.max(0, 16 - (point[2] ?? 0)) * 2;
    }
  }

  // screenPoints.value = scrPoints;

  // runOnJS(log.debug)('projectObject3 result', scrPoints);

  return object;
};

export interface UseProjectionProps {
  width: number;
  height: number;
}

export const useProjection = ({ width, height }: UseProjectionProps) => {
  const camera = useSharedValue<Camera>(createCamera(width, height));
  // const projection = useSharedValue<Projection3 | null>(null);

  const projection = useDerivedValue(() => {
    camera.value.aspectRatio = width / height;
    camera.value.position[2] = -60;
    runOnJS(log.debug)('projection', camera.value);
    const projection = createProjection(camera.value, width, height);
    updateProjectionMatrix(projection);
    updateViewMatrix(projection);
    return projection;
  });

  return { camera, projection };
};

export const useProjectedObject = (
  projection: DerivedValue<Projection3>,
  points: Position3[],
  entities: Entity[]
) => {
  // const [object] = useState<Object3>(() => createObject3(points));
  const object = useMemo(() => createObject3(points), [points]);

  // log.debug('[useProjectedObject] object', points);

  useAnimatedReaction(
    () => object.points.value,
    (points) => {
      // runOnJS(log.debug)('react to rotation', entities?.length);
      if (points) {
        // object.worldRotation;
        rotationXMatrix4x4(
          object.worldTransform.value,
          object.worldRotation.value[0]
        );
        rotationYMatrix4x4(
          object.worldTransform.value,
          object.worldRotation.value[1]
        );
        // rotationYMatrix4x4(object.tempMatrix2, object.worldRotation.value[1]);
        // rotationZMatrix4x4(object.tempMatrix3, object.worldRotation.value[2]);

        // multiplyMatrix4x4(object.worldTransform, object.tempMatrix, object.tempMatrix2);
        // updateViewMatrix(projection.value);
        projectObject3(projection.value, object, entities);
      }
    }
  );

  return object;
};
