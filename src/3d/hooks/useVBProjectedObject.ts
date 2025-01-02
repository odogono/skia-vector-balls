import { useMemo } from 'react';

import { DerivedValue, useAnimatedReaction } from 'react-native-reanimated';

import { createLog } from '@helpers/log';
import { createVBObject } from '../createVBObject';
import { projectVBObject } from '../projectVBObject';
import { GLMProjection, VBCamera, VBObject, VBScreenObject } from '../types';
import { QTrackBallRotatorProps } from './useQTrackballRotator';

export interface UseVBProjectedObjectProps {
  areViewDimsValid: boolean;
  camera: VBCamera;
  projection: DerivedValue<GLMProjection>;
  props: DerivedValue<QTrackBallRotatorProps>;
  points?: vec3[];
  screenObjects: VBScreenObject[];
  object?: VBObject;
}

const log = createLog('useVBProjectedObject');

export const useVBProjectedObject = ({
  camera,
  projection,
  props,
  points,
  screenObjects,
  object,
  areViewDimsValid
}: UseVBProjectedObjectProps) => {
  const objectFromPoints = useMemo(() => createVBObject(points), [points]);

  const projectedObject = object ?? objectFromPoints;

  if (!projectedObject) {
    throw new Error('No object to project');
  }

  // reprojects the object when the points or the viewMatrix changes
  useAnimatedReaction(
    () =>
      [
        projectedObject.points.value,
        props.value.viewMatrix,
        // viewDimsUpdate.value,
        projection.value
      ] as [vec4[], mat4, GLMProjection],
    ([points, viewMatrix, projection]) => {
      // runOnJS(log.debug)('reprojecting object', {
      //   viewDimsUpdate
      // });
      if (!projection.isValid) return;
      projectVBObject({
        camera,
        projection,
        inputModelview: props.value.viewMatrix,
        object: projectedObject,
        screenObjects
      });
    }
  );

  return object;
};
