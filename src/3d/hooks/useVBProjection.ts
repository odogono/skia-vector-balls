import { LayoutRectangle } from 'react-native';

import {
  DerivedValue,
  runOnJS,
  useDerivedValue
} from 'react-native-reanimated';

import { mat4 } from '@3d/glMatrixWorklet';
import { createLog } from '@helpers/log';
import { GLMProjection } from '../types';

export interface UseVBProjectionProps {
  viewDims: LayoutRectangle;
}

const log = createLog('useVBProjection');

export const useVBProjection = ({ viewDims }: UseVBProjectionProps) => {
  // const areViewDimsValid = useDerivedValue(() => {
  //   // log.debug('areViewDimsValid', viewDims);
  //   return viewDims.width > 0 && viewDims.height > 0;
  // });

  const projection: DerivedValue<GLMProjection> = useDerivedValue(() => {
    const isValid = viewDims.width > 0 && viewDims.height > 0;
    const projection = {
      matrix: mat4.create(),
      screenWidth: viewDims.width,
      screenHeight: viewDims.height,
      isValid
    };

    if (!isValid) return projection;

    const fov = Math.PI / 4; // 45 degrees in radians
    const aspectRatio = viewDims.width / viewDims.height;
    const near = 0.1;
    const far = 1000;

    mat4.perspective(projection.matrix, fov, aspectRatio, near, far);

    return projection;
  });

  return { projection };
};
