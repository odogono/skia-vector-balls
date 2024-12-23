import { mat4, vec4 } from '@3d/glMatrixWorklet';
import { GLMProjection, VBCamera, VBObject, VBScreenObject } from './types';
import { updateModelViewMatrix } from './updateModelViewMatrix';
import { vec3FromVector3 } from './vector3';

interface ProjectVBObjectProps {
  camera: VBCamera;
  projection: GLMProjection;
  inputModelview?: mat4 | undefined;
  object: VBObject;
  screenObjects: VBScreenObject[];
}

export const projectVBObject = ({
  camera,
  projection,
  inputModelview,
  object,
  screenObjects
}: ProjectVBObjectProps) => {
  'worklet';

  const { matrix: projMatrix, screenWidth, screenHeight } = projection;

  const modelview = mat4.clone(camera.matrix.value);
  const modelviewProjection = mat4.create();

  const vec3Translation = vec3FromVector3(object.translation.value);

  mat4.translate(modelview, modelview, vec3Translation);

  if (inputModelview) {
    updateModelViewMatrix(modelview, inputModelview);
  }
  // runOnJS(log.debug)('modelview', object.translation.value);
  // debugMsg.value = `${object.translation.value[0].toFixed(2)} ${object.translation.value[1].toFixed(2)} ${object.translation.value[2].toFixed(2)}`;

  const { x, y, z } = object.rotation.value;

  mat4.rotateX(modelview, modelview, x);
  mat4.rotateY(modelview, modelview, y);
  mat4.rotateZ(modelview, modelview, z);

  const vec3Scale = vec3FromVector3(object.scale.value);
  mat4.scale(modelview, modelview, vec3Scale);

  mat4.multiply(modelviewProjection, projMatrix, modelview);

  const points = object.points.value;
  const screenPoints = object.screenPoints.value;

  // Project points to screen space
  for (let ii = 0; ii < points.length; ii++) {
    const point = points[ii];
    const screenPoint = screenPoints[ii];

    // if we have no more capacity to draw to screen, then break
    if (!screenObjects[ii]) {
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

  if (screenObjects) {
    for (let ii = 0; ii < screenPoints.length; ii++) {
      const screenPoint = screenPoints[ii];
      const screenObject = screenObjects[ii];
      if (!screenObject) {
        break;
      }
      const z = (40 - screenPoint[2]) * 3;
      const blur = z < 40 ? (40 - z) / 3 : 0;
      screenObject.screenPos.value = [screenPoint[0], screenPoint[1], z];
      screenObject.size.value = z;
      screenObject.blur.value = blur;
    }
  }
};
