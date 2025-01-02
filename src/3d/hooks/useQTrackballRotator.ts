import { LayoutRectangle } from 'react-native';

import { Gesture } from 'react-native-gesture-handler';
import { useDerivedValue } from 'react-native-reanimated';

import { mat4, quat, vec2, vec3 } from '@3d/glMatrixWorklet';
import { createLog } from '@helpers/log';

type UseQTrackballRotatorProps = {
  viewDims: LayoutRectangle;
};

export type QTrackBallRotatorProps = {
  viewMatrix: mat4;
  rotation: quat;
  center: vec2;
  prevPos: vec2;
  viewDims: LayoutRectangle;
  // radius2: number;
};

const ROTATION_SENSITIVITY = 24.0;

const log = createLog('useQTrackballRotator');

export const useQTrackballRotator = ({
  viewDims
}: UseQTrackballRotatorProps) => {
  const props = useDerivedValue<QTrackBallRotatorProps>(() => {
    const viewMatrix = mat4.create();
    const rotation = quat.create();
    const center = vec2.fromValues(viewDims.width / 2, viewDims.height / 2);
    const radius = Math.min(center[0], center[1]);
    const prevPos = vec2.fromValues(0, 0);

    const result = {
      viewMatrix,
      rotation,
      center,
      radius,
      prevPos,
      viewDims
    };

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
      const { rotation, prevPos } = props.value;
      const pos = vec2.fromValues(x, y);

      const va = projectToSphere(prevPos, props.value);
      const vb = projectToSphere(pos, props.value);

      // Calculate rotation axis and angle
      const axis = vec3.create();
      vec3.cross(axis, va, vb);

      // Clamp dot product to avoid NaN in acos
      const dot = Math.max(-1.0, Math.min(1.0, vec3.dot(va, vb)));
      // const angle = Math.acos(dot);
      const angle = Math.acos(dot) * ROTATION_SENSITIVITY;

      if (vec3.length(axis) > 1e-6 && angle > 1e-6) {
        const deltaRotation = quat.setAxisAngle(quat.create(), axis, angle);
        quat.normalize(deltaRotation, deltaRotation);
        quat.multiply(rotation, deltaRotation, rotation);
        quat.normalize(rotation, rotation);
      }

      props.modify((p) => {
        p.prevPos = pos;

        updateViewMatrix(p);
        return p;
      });
    })
    .minDistance(1);

  return { gesture, props };
};

const updateViewMatrix = (props: QTrackBallRotatorProps) => {
  'worklet';
  const { viewMatrix, rotation } = props;

  mat4.fromQuat(viewMatrix, rotation);

  return props;
};

// Convert screen coordinates to sphere coordinates
const projectToSphere = (pos: vec2, { viewDims }: QTrackBallRotatorProps) => {
  'worklet';
  const [x, y] = pos;
  const { width, height } = viewDims;

  // Map input to [-1, 1] range
  const r = Math.min(width, height) * 0.5;
  const x2d = (x - width * 0.5) / r;
  const y2d = (height * 0.5 - y) / r; // Invert Y for proper rotation direction

  // Square distance from center
  const d2 = x2d * x2d + y2d * y2d;

  // Use hyperbolic sheet for points outside the sphere
  const z = d2 < 0.5 ? Math.sqrt(1.0 - d2) : 0.5 / Math.sqrt(d2);

  const result = vec3.fromValues(x2d, y2d, z);
  vec3.normalize(result, result);
  return result;
};
