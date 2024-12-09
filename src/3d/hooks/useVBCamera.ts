import { useMemo } from 'react';

import {
  makeMutable,
  runOnJS,
  useAnimatedReaction
} from 'react-native-reanimated';

import { mat4, vec3 } from '@3d/glMatrixWorklet';
import { createLogger } from '@helpers/log';
import { VBCamera } from '../types';

const log = createLogger('useVBCamera');

export type UseVBCameraProps = {
  pos?: vec3;
  lookAt?: vec3;
  up?: vec3;
};

const createVBCamera = ({
  pos,
  lookAt,
  up: upProp
}: UseVBCameraProps): VBCamera => {
  const eye = pos ?? vec3.fromValues(0, 0, -15);
  const center = lookAt ?? vec3.fromValues(0, 0, 0);
  const up = upProp ?? vec3.fromValues(0, 1, 0);
  const matrix = mat4.create();

  mat4.lookAt(matrix, eye, center, up);

  log.debug('createVBCamera', eye, center, up);

  return {
    pos: makeMutable(eye),
    lookAt: makeMutable(center),
    up: makeMutable(up),
    matrix: makeMutable(matrix)
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

      // NOTE - using camera.matrix.modify causes this reaction to fire constantly
      // for some reason
      camera.matrix.value = mat4.lookAt(
        camera.matrix.value,
        pos,
        camera.lookAt.value,
        camera.up.value
      );
    }
  );

  return camera;
};
