import { useEffect, useState } from 'react';

import { createLogger } from '@helpers/log';
import { parseObj } from '@helpers/parseObj';
import { Position3 } from '../types';

const log = createLogger('useObj');

// Define the available geometry files with their dynamic imports
const geometryFiles = {
  cube: () => import('@assets/geometry/cube.json'),
  grid: () => import('@assets/geometry/grid.json'),
  point: () => import('@assets/geometry/point.json'),
  sphere: () => import('@assets/geometry/sphere.json'),
  cylinder: () => import('@assets/geometry/cylinder'),
  tree: () => import('@assets/geometry/tree')
  // Add more geometry files as needed
} as const;

type GeometryKey = keyof typeof geometryFiles;

/**
 * Hook to load and parse a wavefront obj file from assets
 *
 * @param key - Key of the geometry file to load (e.g. 'cube')
 * @returns Array of vertices as Position3
 */
export const useObj = (key: GeometryKey) => {
  const [vertices, setVertices] = useState<Position3[]>([]);

  useEffect(() => {
    const loadGeometry = async () => {
      try {
        const module = await geometryFiles[key]();
        let data = '';
        if (module && 'default' in module) {
          const obj = module.default;
          data = obj.data.join('\n');
        } else if (module && 'geometry' in module) {
          data = module.geometry;
        }
        const parsedVertices = parseObj(data);
        setVertices(parsedVertices);
        log.debug('Parsed vertices', parsedVertices.length, 'from', key);
      } catch (error) {
        log.error('Failed to parse OBJ file:', error);
        setVertices([]);
      }
    };

    loadGeometry();
  }, [key]);

  return vertices;
};
