import * as glMatrix from 'gl-matrix';
import { mat4, vec3, vec4 } from 'gl-matrix';

describe('glmatrix', () => {
  it('should create a projection matrix', () => {
    const points: vec3[] = [
      vec3.fromValues(0, 0, 0),
      vec3.fromValues(1, 1, 1),
      vec3.fromValues(2, 2, 2)
    ];

    const screenWidth = 600;
    const screenHeight = 400;
    const fov = Math.PI / 4; // 45 degrees in radians
    const aspectRatio = screenWidth / screenHeight;
    const near = 0.1;
    const far = 1000;

    const projection = mat4.create(); // projection matrix
    const modelviewProjection = mat4.create(); // combined matrix

    // Create projection matrix
    mat4.perspective(projection, fov, aspectRatio, near, far);

    // Create modelview matrix (in this case just a simple translation to move points in front of camera)
    const modelview = mat4.create();

    const eye = vec3.fromValues(0, 0, -25);
    const center = vec3.fromValues(0, 0, -1);
    const up = vec3.fromValues(0, 1, 0);
    mat4.lookAt(modelview, eye, center, up);

    // mat4.translate(modelview, modelview, [0, 0, 25]); // Move 5 units back

    // Apply the modeling transformation to modelview
    // mat4.rotateX(modelview, modelview, rotateX);
    // mat4.rotateY(modelview, modelview, rotateY);
    // mat4.rotateZ(modelview, modelview, rotateZ);

    // Combine matrices
    mat4.multiply(modelviewProjection, projection, modelview);

    // Project points to screen space
    const screenPoints = points.map((point) => {
      // Create homogeneous coordinate
      const vec4Point = vec4.fromValues(point[0], point[1], point[2], 1.0);
      // Transform point
      vec4.transformMat4(vec4Point, vec4Point, modelviewProjection);

      // Perform perspective divide
      const w = vec4Point[3];
      const screenX = (vec4Point[0] / w + 1) * 0.5 * screenWidth;
      const screenY = (1 - vec4Point[1] / w) * 0.5 * screenHeight;
      const screenZ = vec4Point[2] / w;

      return [screenX, screenY, screenZ];
    });

    // sort the screenPoints by screenZ
    screenPoints.sort((a, b) => a[2] - b[2]);

    // Verify results
    expect(screenPoints.length).toBe(points.length);
    // screenPoints.forEach((point) => {
    //   // Screen coordinates should be within screen dimensions
    //   expect(point[0]).toBeGreaterThanOrEqual(0);
    //   expect(point[0]).toBeLessThanOrEqual(screenWidth);
    //   expect(point[1]).toBeGreaterThanOrEqual(0);
    //   expect(point[1]).toBeLessThanOrEqual(screenHeight);
    // });

    // console.log(screenPoints);
  });
});
