import { useMemo } from 'react';

import {
  makeMutable,
  runOnJS,
  useAnimatedReaction
} from 'react-native-reanimated';

import { mat4, vec3 } from '@3d/glMatrixWorklet';
import { createLogger } from '@helpers/log';
import { Vector3 } from '@types';
import { VBCamera } from '../types';
import { createVector3, vec3FromVector3 } from '../vector3';

const log = createLogger('useVBCamera');

export type UseVBCameraProps = {
  pos?: Vector3;
  lookAt?: Vector3;
  up?: Vector3;
};

const createVBCamera = ({
  pos,
  lookAt,
  up: upProp
}: UseVBCameraProps): VBCamera => {
  const eye = pos ?? createVector3(0, 0, -15);
  const center = lookAt ?? createVector3(0, 0, 0);
  const up = upProp ?? createVector3(0, 1, 0);
  const matrix = mat4.create();

  mat4.lookAt(
    matrix,
    vec3FromVector3(eye),
    vec3FromVector3(center),
    vec3FromVector3(up)
  );

  log.debug('createVBCamera', eye, center, up);

  return {
    pos: makeMutable<Vector3>(eye),
    lookAt: makeMutable<Vector3>(center),
    up: makeMutable<Vector3>(up),
    matrix: makeMutable<mat4>(matrix)
  };
};

export const useVBCamera = (props: UseVBCameraProps = {}) => {
  // only create once - changes to camera props should be done
  // directly since they are MutableValues
  const camera = useMemo(() => createVBCamera(props), []);

  useAnimatedReaction(
    () => [camera.pos.value, camera.lookAt.value, camera.up.value],

    ([pos, lookAt, up]) => {
      // runOnJS(log.debug)('camera +', pos);

      const vec3Pos = vec3FromVector3(pos);
      const vec3LookAt = vec3FromVector3(lookAt);
      const vec3Up = vec3FromVector3(up);
      // NOTE - using camera.matrix.modify causes this reaction to fire constantly
      // for some reason
      camera.matrix.value = mat4.lookAt(
        camera.matrix.value,
        vec3Pos,
        vec3LookAt,
        vec3Up
      );
    }
  );

  return camera;
};
