import { Axis, Coordinate3D, Execute, Face } from './format';
import { shift } from './pathfinding';

const faceToString = (face: Face): string => {
  return JSON.stringify(face);
}

const coordToString = (coord: Coordinate3D): string => {
  return JSON.stringify(coord);
}

const getFaces = ([x, y, z]: Coordinate3D): Face[] => {
  return Object.keys(Axis)
    .map((axis: Axis) => {
      const [a, b] = {
        x: [
          [x - 1, x],
          [x, x + 1],
        ],
        y: [
          [y - 1, y],
          [y, y + 1],
        ],
        z: [
          [z - 1, z],
          [z, z + 1],
        ],
      }[axis];
      return [
        {
          axis,
          x,
          y,
          z,
          [axis]: a,
        },
        {
          axis,
          x,
          y,
          z,
          [axis]: b,
        }
      ];
    })
    .flat();
}

export const execute: Execute = (coordinates) => {
  const blocks = new Set<string>(coordinates.map(coordToString));
  const air = new Set<string>();
  let surfaceArea = 0;
  // thought was to store coords for air by checking neighbors (should btw probs turn this into a BFS neighbor check and only record faces when neighbor is empty but ignore for now)
  // then storing neighbor coords not found in the original set as an air coord
  // then iterate through all air coords, and 'search' line all 6 directions for known 'non-air' coords in the original set
  // continue process for adjacent air coords until no adjacent air coords are found - if this is the case, then the air pocket is internal.
  // if at any point you discover a direction without a known coord, then that points outward and is exposed.
  // however this requires slicing the list of coords by axis at each air pocket, which is a huge amount of computations

  console.log('blocks', blocks);

  coordinates.forEach((coordinate) => {
    console.log('coordinate', coordinate);
    Object.keys(Axis)
      .forEach((axis: Axis) => {
        [-1, 1].forEach((distance) => {
          const adjacent = shift(coordinate, axis, distance);
          const adjacentStr = coordToString(adjacent);
          console.log(' - adj', axis, distance, adjacentStr, blocks.has(adjacentStr) ? 'b' : 'a');
          if (!blocks.has(adjacentStr)) {
            surfaceArea += 1;
            air.add(adjacentStr);
          }
        });
      });
  });

  console.log('air', air);

  return surfaceArea;
}