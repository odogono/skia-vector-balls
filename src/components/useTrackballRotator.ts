import { LayoutRectangle } from 'react-native';

import { SkPoint, Skia } from '@shopify/react-native-skia';
import { Gesture } from 'react-native-gesture-handler';
import {
  runOnJS,
  useAnimatedReaction,
  useDerivedValue,
  useSharedValue
} from 'react-native-reanimated';

import {
  debugMsg2,
  debugMsg3,
  debugMsg4,
  debugMsg5,
  debugMsg
} from '@components/Debug/Debug';
import { mat4, vec2, vec3 } from '@helpers/glMatrixWorklet';
import { createLogger } from '@helpers/log';

type UseDrawGestureProps = {
  viewDistance: number | undefined;
  viewpointDirection: vec3 | undefined;
  viewUp: vec3 | undefined;
  layout: LayoutRectangle;
};

export type TrackBallRotatorProps = {
  viewMatrix: mat4;
  viewDistance: number | undefined;
  unitX: vec3;
  unitY: vec3;
  unitZ: vec3;
  center: vec2;
  prevPos: vec2;
  radius2: number;
};

const log = createLogger('useTrackballRotator');
/**
 *
 * https://math.hws.edu/graphicsbook/source/webgl/trackball-rotator.js
 *
 * @param param0
 * @returns
 */
export const useTrackballRotator = ({
  layout,
  viewDistance = -10,
  viewpointDirection = [0, 0, -10],
  viewUp = [0, 1, 0]
}: UseDrawGestureProps) => {
  // const pViewMatrix = useSharedValue<mat4>(mat4.create());

  const props = useDerivedValue<TrackBallRotatorProps>(() => {
    const viewMatrix = mat4.create();
    const unitX = vec3.fromValues(0, 0, 0);
    const unitY = vec3.fromValues(0, 0, 0);
    const unitZ = viewpointDirection ?? vec3.fromValues(0, 0, 10);
    const prevPos = vec2.fromValues(0, 0);
    const center = vec2.fromValues(layout.width / 2, layout.height / 2);
    const radius = Math.min(center[0], center[1]);

    vec3.normalize(unitZ, unitZ);
    vec3.copy(unitY, unitZ);
    vec3.scale(unitY, unitY, vec3.dot(unitZ, viewUp));
    vec3.subtract(unitY, viewUp, unitY);
    vec3.normalize(unitY, unitY);
    vec3.cross(unitX, unitY, unitZ);

    const result = {
      viewMatrix,
      viewDistance,
      unitX,
      unitY,
      unitZ,
      center,
      radius2: radius * radius,
      prevPos
    };
    // runOnJS(log.debug)('🔥 props init', {
    //   unitX,
    //   unitY,
    //   unitZ,
    //   center,
    //   radius2: radius * radius,
    //   prevPos
    // });

    updateViewMatrix(result);

    return result;
  });

  const gesture = Gesture.Pan()
    .onStart(({ x, y }) => {
      props.modify((p) => {
        p.prevPos = vec2.fromValues(x, y);
        return p;
      });
    })
    .onUpdate(({ x, y }) => {
      // debugMsg.value = `x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;

      debugMsg.value = `prev x: ${props.value.prevPos[0].toFixed(2)}, y: ${props.value.prevPos[1].toFixed(2)}`;
      debugMsg2.value = `curr x: ${x.toFixed(2)}, y: ${y.toFixed(2)}`;

      const ray1 = toRay(props.value.prevPos, props.value);
      const ray2 = toRay(vec2.fromValues(x, y), props.value);

      applyTransvection(ray1, ray2, props.value);

      // props.value.prevPos = vec2.fromValues(x, y);

      const { unitX, unitY, unitZ } = props.value;

      // debugMsg2.value = `${unitX[0].toFixed(2)} ${unitX[1].toFixed(2)} ${unitX[2].toFixed(2)}`;
      // debugMsg3.value = `${unitY[0].toFixed(2)} ${unitY[1].toFixed(2)} ${unitY[2].toFixed(2)}`;
      // debugMsg4.value = `${unitZ[0].toFixed(2)} ${unitZ[1].toFixed(2)} ${unitZ[2].toFixed(2)}`;

      props.modify((p) => {
        p.prevPos = vec2.fromValues(x, y);
        // p.unitX = unitX;
        // p.unitY = unitY;
        // p.unitZ = unitZ;
        updateViewMatrix(p);
        return p;
      });
    })
    .onEnd(() => {})
    .minDistance(1);

  return { gesture, props };
};

const updateViewMatrix = (props: TrackBallRotatorProps) => {
  'worklet';
  const { unitX, unitY, unitZ, viewMatrix, viewDistance } = props;
  mat4.set(
    viewMatrix,
    unitX[0],
    unitY[0],
    unitZ[0],
    0,
    unitX[1],
    unitY[1],
    unitZ[1],
    0,
    unitX[2],
    unitY[2],
    unitZ[2],
    0,
    0,
    0,
    0,
    1
  );

  if (viewDistance !== undefined) {
    viewMatrix[14] -= viewDistance;
  }
  return props;
};

const toRay = (
  pos: vec2,
  { center, radius2, unitX, unitY, unitZ }: TrackBallRotatorProps
): vec3 => {
  'worklet';
  const dx = pos[0] - center[0];
  const dy = center[1] - pos[1];

  const vx = dx * unitX[0] + dy * unitY[0]; // The mouse point as a vector in the image plane.
  const vy = dx * unitX[1] + dy * unitY[1];
  const vz = dx * unitX[2] + dy * unitY[2];
  const dist2 = vx * vx + vy * vy + vz * vz;
  if (dist2 > radius2) {
    // Map a point ouside the circle to itself
    return [vx, vy, vz];
  }
  const z = Math.sqrt(radius2 - dist2);
  return [vx + z * unitZ[0], vy + z * unitZ[1], vz + z * unitZ[2]];
};

const applyTransvection = (
  e1: vec3,
  e2: vec3,
  { unitZ, unitX, unitY }: TrackBallRotatorProps
) => {
  'worklet';

  vec3.normalize(e1, e1);
  vec3.normalize(e2, e2);

  const e = vec3.fromValues(0, 0, 0);
  vec3.add(e, e1, e2);
  vec3.normalize(e, e);

  const temp = vec3.fromValues(0, 0, 0);
  vec3.reflectInAxis(e, unitZ, temp);
  vec3.reflectInAxis(e1, temp, unitZ);
  vec3.reflectInAxis(e, unitX, temp);
  vec3.reflectInAxis(e1, temp, unitX);
  vec3.reflectInAxis(e, unitY, temp);
  vec3.reflectInAxis(e1, temp, unitY);
};
