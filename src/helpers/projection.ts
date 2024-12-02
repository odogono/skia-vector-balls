import { createLogger } from '@helpers/log';
import { Position2, Position3 } from '@types';
import { Matrix4x4 } from './matrix44';

export interface Camera {
  position: Position3;
  rotation: Position3; // Rotation angles in radians
  fov: number;
  aspectRatio: number;
  near: number;
  far: number;
}

const log = createLogger('Projection');

export class Projection {
  projectionMatrix: Matrix4x4;
  viewMatrix: Matrix4x4;
  camera: Camera;
  private screenWidth: number;
  private screenHeight: number;

  constructor(camera: Camera, screenWidth: number, screenHeight: number) {
    this.camera = camera;
    this.screenWidth = screenWidth;
    this.screenHeight = screenHeight;
    this.projectionMatrix = this.createProjectionMatrix();
    this.viewMatrix = this.createViewMatrix();
  }

  createProjectionMatrix(): Matrix4x4 {
    const matrix = new Matrix4x4();
    const fovRad = (this.camera.fov * Math.PI) / 180;
    const f = 1.0 / Math.tan(fovRad / 2);
    const rangeInv = 1 / (this.camera.near - this.camera.far);

    matrix.data = [
      [f / this.camera.aspectRatio, 0, 0, 0],
      [0, f, 0, 0],
      [0, 0, (this.camera.near + this.camera.far) * rangeInv, -1],
      [0, 0, this.camera.near * this.camera.far * rangeInv * 2, 0]
    ];

    return matrix;
  }

  createViewMatrix(): Matrix4x4 {
    // Create rotation matrices
    const rotationX = Matrix4x4.rotationX(this.camera.rotation[0]);
    const rotationY = Matrix4x4.rotationY(this.camera.rotation[1]);
    const rotationZ = Matrix4x4.rotationZ(this.camera.rotation[2]);

    // Combine rotations
    const xy = Matrix4x4.multiply(rotationX, rotationY);
    const rotation = Matrix4x4.multiply(xy, rotationZ);

    // Create translation matrix (negative camera position for view matrix)
    const translation = Matrix4x4.translation(
      -this.camera.position[0],
      -this.camera.position[1],
      -this.camera.position[2]
    );

    // Combine translation and rotation
    return Matrix4x4.multiply(rotation, translation);
  }

  projectPoint(point: Position3, worldTransform?: Matrix4x4): Position3 | null {
    // Apply world transform if provided
    let transformedPoint = point;

    if (worldTransform) {
      transformedPoint = worldTransform.transformPoint(point);
    }

    // Apply view transform
    // log.debug('projectPoint viewMatrix', this.viewMatrix);
    const viewTransformed = this.viewMatrix.transformPoint(transformedPoint);

    // Apply projection transform
    const projected = this.projectionMatrix.transformPoint(viewTransformed);

    // Check if point is behind camera
    if (projected[2] <= 0) {
      return null;
    }

    // Convert to screen coordinates
    // log.debug('projected', projected);
    return [
      (projected[0] + 1) * 0.5 * this.screenWidth,
      (1 - (projected[1] + 1) * 0.5) * this.screenHeight,
      projected[2]
    ];
  }

  projectPoints(
    points: Position3[],
    worldTransform?: Matrix4x4
  ): (Position3 | null)[] {
    return points.map((point) => this.projectPoint(point, worldTransform));
  }
}
