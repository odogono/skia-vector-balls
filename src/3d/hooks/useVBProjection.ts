import { LayoutRectangle } from 'react-native';

import { useDerivedValue } from 'react-native-reanimated';

import { mat4 } from '@3d/glMatrixWorklet';

export interface UseVBProjectionProps {
  layout: LayoutRectangle;
}

export const useVBProjection = ({ layout }: UseVBProjectionProps) => {
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

  return { projection };
};
