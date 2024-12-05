import { useMemo } from 'react';
import { LayoutRectangle } from 'react-native';

import {
  makeMutable,
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useFrameCallback,
  useSharedValue,
  type DerivedValue
} from 'react-native-reanimated';

import { mat4, vec3, vec4 } from '@3d/glMatrixWorklet';
import { Entity } from '@3d/model/VectorBallStore';
import { createLogger } from '@helpers/log';
import { Mutable } from '@types';
import { QTrackBallRotatorProps } from './useQTrackballRotator';

export type GLMObject = {
  points: Mutable<vec4[]>;
  screenPoints: Mutable<vec4[]>;
  sizes: Mutable<number[]>;
  blur: Mutable<number[]>;
  rotationX: Mutable<number>;
  rotationY: Mutable<number>;
  rotationZ: Mutable<number>;
  translation: Mutable<vec3>;
  scale: Mutable<vec3>;
  // translationX: Mutable<number>;
  // translationY: Mutable<number>;
  // translationZ: Mutable<number>;
};

const log = createLogger('useGLMatrixProjection');

export const createGLMObject = (points: vec3[]): GLMObject => {
  const points4 = points.map((point) =>
    vec4.fromValues(point[0], point[1], point[2], 1)
  );
  const screenPoints = points4.slice();
  const sizes = Array.from({ length: points.length }, () => 1);
  const blur = Array.from({ length: points.length }, () => 0);

  return {
    points: makeMutable(points4),
    screenPoints: makeMutable(screenPoints),
    sizes: makeMutable(sizes),
    blur: makeMutable(blur),
    rotationX: makeMutable(0),
    rotationY: makeMutable(0),
    rotationZ: makeMutable(0),
    translation: makeMutable(vec3.fromValues(0, 0, 0)),
    scale: makeMutable(vec3.fromValues(1, 1, 1))
    // translationY: makeMutable(0),
    // translationZ: makeMutable(0)
  };
};

interface ProjectGLMObjectProps {
  projection: GLMProjection;
  inputModelview?: mat4 | undefined;
  object: GLMObject;
  entities: Entity[];
}

const updateModelViewMatrix = (modelViewMatrix: mat4, rotationMatrix: mat4) => {
  'worklet';
  // Extract the camera position
  const cameraPos = vec3.create();
  mat4.getTranslation(cameraPos, modelViewMatrix);

  // Create a pure rotation matrix by removing translation
  const viewRotation = mat4.clone(modelViewMatrix);
  viewRotation[12] = viewRotation[13] = viewRotation[14] = 0;

  // Apply trackball rotation to view rotation
  mat4.multiply(viewRotation, viewRotation, rotationMatrix);

  // Reconstruct matrix with camera position
  viewRotation[12] = cameraPos[0];
  viewRotation[13] = cameraPos[1];
  viewRotation[14] = cameraPos[2];

  // Update the model view matrix
  mat4.copy(modelViewMatrix, viewRotation);

  return modelViewMatrix;
};

export const projectGLMObject = ({
  projection,
  inputModelview,
  object,
  entities
}: ProjectGLMObjectProps) => {
  'worklet';

  const { matrix: projMatrix, screenWidth, screenHeight } = projection;

  const modelview = mat4.create();
  const modelviewProjection = mat4.create();

  const eye = vec3.fromValues(0, 0, -15);
  const center = vec3.fromValues(0, 0, -1);
  const up = vec3.fromValues(0, 1, 0);
  mat4.lookAt(modelview, eye, center, up);

  mat4.translate(modelview, modelview, object.translation.value);

  if (inputModelview) {
    updateModelViewMatrix(modelview, inputModelview);
  }
  // runOnJS(log.debug)('modelview', object.translation.value);
  // debugMsg.value = `${object.translation.value[0].toFixed(2)} ${object.translation.value[1].toFixed(2)} ${object.translation.value[2].toFixed(2)}`;

  mat4.scale(modelview, modelview, object.scale.value);

  mat4.rotateX(modelview, modelview, object.rotationX.value);
  mat4.rotateY(modelview, modelview, object.rotationY.value);
  mat4.rotateZ(modelview, modelview, object.rotationZ.value);

  mat4.multiply(modelviewProjection, projMatrix, modelview);

  // runOnJS(log.debug)('projMatrix', projMatrix);
  // runOnJS(log.debug)('modelviewProjection', modelviewProjection);

  const points = object.points.value;
  const screenPoints = object.screenPoints.value;

  // Project points to screen space
  for (let ii = 0; ii < points.length; ii++) {
    const point = points[ii];
    const screenPoint = screenPoints[ii];
    const entity = entities[ii];
    if (!entity) {
      break;
    }
    // Create homogeneous coordinate
    const vec4Point = vec4.fromValues(point[0], point[1], point[2], 1.0);

    // runOnJS(log.debug)('vec4Point', ii, vec4Point);
    // Transform point
    vec4.transformMat4(vec4Point, vec4Point, modelviewProjection);

    // runOnJS(log.debug)('vec4Point', ii, vec4Point);

    // Perform perspective divide
    const w = vec4Point[3];
    screenPoint[0] = (vec4Point[0] / w + 1) * 0.5 * screenWidth;
    screenPoint[1] = (1 - vec4Point[1] / w) * 0.5 * screenHeight;
    screenPoint[2] = vec4Point[2]; //(40 - vec4Point[2]) * 3; // / w;
    // runOnJS(log.debug)('screenPoint', ii, vec4Point[2], screenPoint[2]);
  }

  // sort the screenPoints by screenZ
  screenPoints.sort((a, b) => b[2] - a[2]);

  if (entities) {
    for (let ii = 0; ii < screenPoints.length; ii++) {
      const screenPoint = screenPoints[ii];
      const entity = entities[ii];
      if (!entity) {
        break;
      }
      const z = (40 - screenPoint[2]) * 3;
      const blur = z < 40 ? (40 - z) / 3 : 0;
      // runOnJS(log.debug)('screenPoint', ii, screenPoint[2], z, blur);
      entity.screenPos.value = [screenPoint[0], screenPoint[1], z];
      entity.size.value = z;
      entity.blur.value = blur;
    }
  }
};

export type GLMProjection = {
  matrix: mat4;
  screenWidth: number;
  screenHeight: number;
};

export interface UseGLMatrixProjectionProps {
  layout: LayoutRectangle;
}

export const useGLMatrixProjection = ({
  layout
}: UseGLMatrixProjectionProps) => {
  const modelview = useSharedValue<mat4>(mat4.create());

  const projection = useDerivedValue(() => {
    const projection = {
      matrix: mat4.create(),
      screenWidth: layout.width,
      screenHeight: layout.height
    };
    const fov = Math.PI / 4; // 45 degrees in radians
    const aspectRatio = layout.width / layout.height;
    const near = 0.1;
    const far = 1000;

    mat4.perspective(projection.matrix, fov, aspectRatio, near, far);

    return projection;
  });

  return { projection, modelview };
};

export interface UseGLMatrixProjectedObjectProps {
  projection: DerivedValue<GLMProjection>;
  // modelView?: mat4 | undefined;
  props: DerivedValue<QTrackBallRotatorProps>;
  points: vec3[];
  entities: Entity[];
}

export const useGLMatrixProjectedObject = ({
  projection,
  props,
  points,
  entities
}: UseGLMatrixProjectedObjectProps) => {
  // const defaultModelView = useSharedValue<mat4>(mat4.create());
  // const modelViewProjection = props?.value.viewMatrix ?? mat4.create();

  const object = useMemo(() => createGLMObject(points), [points]);

  useAnimatedReaction(
    () => [object.points.value, props.value.viewMatrix],
    ([points, viewMatrix]) => {
      // runOnJS(log.debug)('react to rotation', points?.length);

      projectGLMObject({
        projection: projection.value,
        inputModelview: props.value.viewMatrix,
        object,
        entities
      });
    }
  );

  return object;
};
