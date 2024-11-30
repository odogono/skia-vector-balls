import { Position3 } from '../types';

/**
 * Parses a wavefront obj file and returns a list of vertices
 *
 * @param obj - String content of the wavefront obj file
 * @returns Array of Position3 representing the vertices
 */
export const parseObj = (obj: string): Position3[] => {
  const vertices: Position3[] = [];

  // Split the file content into lines
  const lines = obj.split('\n');

  // Process each line
  for (const line of lines) {
    // Remove any trailing/leading whitespace
    const trimmedLine = line.trim();

    // Skip empty lines or comments
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    // Split the line into components
    const parts = trimmedLine.split(/\s+/);

    // Check if this line defines a vertex
    if (parts[0] === 'v') {
      // Convert the x, y, z coordinates to numbers
      const x = parseFloat(parts[1]);
      const y = parseFloat(parts[2]);
      const z = parseFloat(parts[3]);

      // Skip invalid vertices
      if (isNaN(x) || isNaN(y) || isNaN(z)) {
        continue;
      }

      // Add the vertex to our list
      vertices.push([x, y, z]);
    }
  }

  return vertices;
};
