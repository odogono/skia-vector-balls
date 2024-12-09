import { mat4, vec3 } from '@3d/glMatrixWorklet';

export const updateModelViewMatrix = (
  modelViewMatrix: mat4,
  rotationMatrix: mat4
) => {
  'worklet';
  // Extract the camera position
  const cameraPos = vec3.create();
  mat4.getTranslation(cameraPos, modelViewMatrix);

  // Create a pure rotation matrix by removing translation
  const viewRotation = mat4.clone(modelViewMatrix);
  viewRotation[12] = 0;
  viewRotation[13] = 0;
  viewRotation[14] = 0;

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
