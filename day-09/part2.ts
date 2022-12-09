import { Execute } from './format';
import { Coordinate, coordsMatch, traverse } from '@utils/grid';
import { DirectionFlippedVert } from './shared';
import { generate } from '@utils/array';
import { printWithAnswer } from '@utils/debug';

const DEBUG = false;

type Bounds = {
  x: [min: number, max: number],
  y: [min: number, max: number],
}

const visitedToString = (bounds: Bounds, visited: Set<string>): string => {
  const lines = [];
  for(let y = bounds.y[0]; y < bounds.y[1]; y++) {
    let line = '';
    for(let x = bounds.x[0]; x < bounds.x[1]; x++) {
      const isStart = coordsMatch([x, y], [0, 0]);
      const wasVisited = visited.has(`${x},${y}`);
      line += isStart ? 's' : wasVisited ? '#' : '.';
    }
    lines.push(line);
  }
  return lines.reverse().join('\n');
}


const printGrid = (bounds: Bounds, rope: Coordinate[]) => {
  const lines = [];
  for(let y = bounds.y[0]; y < bounds.y[1]; y++) {
    let line = '';
    for(let x = bounds.x[0]; x < bounds.x[1]; x++) {
      const ropeI = rope.findIndex((c) =>
        coordsMatch(c, [x, y])
      );

      const value = ropeI > -1
        ? ropeI === 0 ? 'H'
          : ropeI === rope.length - 1 ? 'T'
            : ropeI
        : '.';

      line += value;
    }
    lines.push(line);
  }
  console.log(
    lines.reverse().join('\n')
  );
}

const visited = new Set<string>([
  '0,0',
]);

const moveTail = (h: Coordinate, t: Coordinate): Coordinate => {
  const offsetHorizontal = h[0] - t[0];
  const offsetVertical = h[1] - t[1];

  const distHorizontal = Math.abs(offsetHorizontal);
  const distVertical = Math.abs(offsetVertical);

  if (distHorizontal <= 1 && distVertical <= 1) {
    return t;
  }

  if (distHorizontal > distVertical) {
    return [
      h[0] - Math.sign(offsetHorizontal),
      h[1],
    ];
  } else {
    return [
      h[0],
      h[1] - Math.sign(offsetVertical),
    ];
  }
}

export const execute: Execute = (movements) => {
  let rope: Coordinate[] = generate(10, [0, 0]);
  let bounds: Bounds = {
    x: [0, 5],
    y: [0, 5],
  };

  if (DEBUG) {
    console.log(`start`);
    printGrid(bounds, rope);
  }

  movements.forEach((movement) => {
    for(let i = 0; i < movement.distance; i++) {
      // Move head
      rope[0] = traverse(rope[0], DirectionFlippedVert[movement.direction]);

      for(let k = 1; k < rope.length; k++) {
        const knot = moveTail(rope[k - 1], rope[k]);

        const didMove = !coordsMatch(rope[k], knot);

        if (didMove) {
          rope[k] = knot;
        } else {
          if (DEBUG) {
            console.log(`knot ${k} did not move - skipping to next movement`);
          }
          break;
        }

        const isLast = k === rope.length - 1;

        if (isLast) {
          visited.add(`${knot[0]},${knot[1]}`)

          if (DEBUG) {
            console.log(`knot ${k} did not move - skipping to next movement`);
          }
        }
      }

      const h = rope[0];
      bounds.x = [
        Math.min(bounds.x[0], h[0]),
        Math.max(bounds.x[1], h[0]),
      ];
      bounds.y = [
        Math.min(bounds.y[0], h[1]),
        Math.max(bounds.y[1], h[1]),
      ];
      if (DEBUG) {
        console.log(`\n${movement.direction}`);
        printGrid(bounds, rope);
      }
    }
  });

  if (DEBUG || true) {
    console.log(`\nvisited:`);
    const visitedString = visitedToString(bounds, visited);
    console.log(visitedString);
    printWithAnswer('visited', visitedString);
  }

  return visited.size;
}