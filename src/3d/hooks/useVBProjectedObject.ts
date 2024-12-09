import { useMemo } from 'react';

import { DerivedValue, useAnimatedReaction } from 'react-native-reanimated';

import { createVBObject } from '../createVBObject';
import { projectVBObject } from '../projectVBObject';
import { GLMProjection, VBCamera, VBScreenObject } from '../types';
import { QTrackBallRotatorProps } from './useQTrackballRotator';

export interface UseVBProjectedObjectProps {
  camera: VBCamera;
  projection: DerivedValue<GLMProjection>;
  props: DerivedValue<QTrackBallRotatorProps>;
  points: vec3[];
  screenObjects: VBScreenObject[];
}

export const useVBProjectedObject = ({
  camera,
  projection,
  props,
  points,
  screenObjects
}: UseVBProjectedObjectProps) => {
  const object = useMemo(() => createVBObject(points), [points]);

  useAnimatedReaction(
    () => [object.points.value, props.value.viewMatrix],
    ([points, viewMatrix]) => {
      // runOnJS(log.debug)('react to rotation', points?.length);

      projectVBObject({
        camera,
        projection: projection.value,
        inputModelview: props.value.viewMatrix,
        object,
        screenObjects
      });
    }
  );

  return object;
};
