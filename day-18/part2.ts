import { Axis, Coordinate3D, Execute } from './format';
import { Bounds, distanceToEdge, getAdjacentCoordinates, shift, StackEntry } from './pathfinding';
import { log } from '@utils/debug';
import { binaryInsert } from '@utils/array';

const knownExternalAir = new Set<string>();

const updateBounds = (bounds: Bounds, [x, y, z]: Coordinate3D): Bounds => {
  return {
    x: [
      Math.min(bounds.x[0], x),
      Math.max(bounds.x[1], x),
    ],
    y: [
      Math.min(bounds.y[0], y),
      Math.max(bounds.y[1], y),
    ],
    z: [
      Math.min(bounds.z[0], z),
      Math.max(bounds.z[1], z),
    ],
  };
}

const coordToString = (coord: Coordinate3D): string => {
  return JSON.stringify(coord);
}

const stringToCoord = (string: string): Coordinate3D => {
  return JSON.parse(string);
}

const surfaceAreaForShape = (coordinates: Coordinate3D[]): number => {
  const blocks = new Set<string>(coordinates.map(coordToString));
  let surfaceArea = 0;

  coordinates.forEach((coordinate) => {
    Object.keys(Axis)
      .forEach((axis: Axis) => {
        [-1, 1].forEach((distance) => {
          const adjacent = shift(coordinate, axis, distance);
          const adjacentStr = coordToString(adjacent);
          if (!blocks.has(adjacentStr)) {
            surfaceArea += 1;
          }
        });
      });
  });

  return surfaceArea;
}

export const execute: Execute = (coordinates) => {
  const blocks = new Set<string>(coordinates.map(coordToString));
  const air = new Map<string, number>();
  const airCorners = new Set<string>();
  let bounds: Bounds = {
    x: [Infinity, -Infinity],
    y: [Infinity, -Infinity],
    z: [Infinity, -Infinity],
  };
  let surfaceArea = 0;
  // thought was to store coords for air by checking neighbors (should btw probs turn this into a BFS neighbor check and only record faces when neighbor is empty but ignore for now)
  // then storing neighbor coords not found in the original set as an air coord
  // then iterate through all air coords, and 'search' line all 6 directions for known 'non-air' coords in the original set
  // continue process for adjacent air coords until no adjacent air coords are found - if this is the case, then the air pocket is internal.
  // if at any point you discover a direction without a known coord, then that points outward and is exposed.
  // however this requires slicing the list of coords by axis at each air pocket, which is a huge amount of computations

  coordinates.forEach((coordinate) => {
    bounds = updateBounds(bounds, coordinate);
    getAdjacentCoordinates(coordinate)
      .forEach((adjacent) => {
        const adjacentStr = coordToString(adjacent);
        if (!blocks.has(adjacentStr)) {
          surfaceArea += 1;
          const numberOfBlocksAdjacentToAir = (air.get(adjacentStr) || 0) + 1;
          air.set(adjacentStr, numberOfBlocksAdjacentToAir);
          // if the air coordinate shares 3 (or more) faces with the structure, it could be an internal air
          if (numberOfBlocksAdjacentToAir === 3) {
            airCorners.add(adjacentStr);
          }
        }
      });
  });

  console.log('airCorners', airCorners);
  console.log('air', air);

  const exteriorCoordinates = new Set<string>();

  const pathToBoundary = (start: Coordinate3D, bounds: Bounds): {
    path: Coordinate3D[],
    type: 'interior' | 'exterior',
  } => {
    const visitedCoordinates = new Set<string>(
      [coordToString(start)]
    );

    const toEntry = (coordinate: Coordinate3D, path: Coordinate3D[]): StackEntry => {
      return {
        path: [coordinate, ...path],
        distance: distanceToEdge(coordinate, bounds),
      }
    }

    let stack: StackEntry[] = [
      {
        path: [start],
        distance: distanceToEdge(start, bounds),
      }
    ];

    while (stack.length > 0) {
      const {
        path,
        distance,
      } = stack.shift();
      const from = path[0];

      if (distance < 0) {
        return {
          path,
          type: 'exterior',
        };
      }

      const adjacent = getAdjacentCoordinates(from)
        .filter((coordinate) =>
          !blocks.has(coordToString(coordinate)) && !visitedCoordinates.has(coordToString(coordinate))
        )
        .map((coordinate) => toEntry(coordinate, path));

      if (adjacent.length < 1) {
        // log(() => `No valid adjacent cells at ${coordToString(from)} - inner air pocket found`);
        // break;
        log(() => `No valid adjacent cells at ${coordToString(from)} - ignoring`);
        continue;
      }

      const sortedAdjacent = adjacent
        .sort((a, b) => a.distance - b.distance);

      for(const entry of sortedAdjacent) {
        const entryCoord = entry.path[0];
        const entryDistance = entry.distance;
        const entryCoordString = coordToString(entryCoord);

        if (exteriorCoordinates.has(entryCoordString)) {
          return {
            type: 'exterior',
            path: path,
          }
        }

        visitedCoordinates.add(entryCoordString);
        stack = binaryInsert(
          stack,
          {
            ...entry,
            distance: entryDistance,
          },
          (entry) => entry.distance
        );
      }
    }

    return {
      type: 'interior',
      path: Array.from(
        visitedCoordinates
      ).map((str) => {
        return stringToCoord(str)
      })
    };
  }

  console.log('bounds', bounds);

  const possibleInteriorCoordinates = new Set<string>(Array.from(airCorners));
  let interiorCoordinatesToInvestigate = Array.from(possibleInteriorCoordinates);

  while (interiorCoordinatesToInvestigate.length > 0) {
    const coordinate = stringToCoord(
      interiorCoordinatesToInvestigate.shift()
    );
    const {
      type,
      path
    } = pathToBoundary(coordinate, bounds);
    // console.log('investigate', coordinate, type, path);

    if (type === 'exterior') {
      path.forEach((exteriorCoord) => {
        exteriorCoordinates.add(coordToString(exteriorCoord));
      });
    }
    if (type === 'interior') {
      const surfaceAreaOfPocket = surfaceAreaForShape(path);
      console.log('interior found', path, surfaceAreaOfPocket);
      surfaceArea -= surfaceAreaOfPocket;
      path.forEach((interiorCoordinate) => {
        possibleInteriorCoordinates.delete(coordToString(interiorCoordinate));
      });
      interiorCoordinatesToInvestigate = Array.from(possibleInteriorCoordinates);
    }
  }

  return surfaceArea;
}