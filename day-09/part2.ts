import { Execute } from './format';
import { Coordinate, traverse } from '@utils/grid';
import { DirectionFlippedVert, printVisited } from './shared';

const DEBUG = false;

const printGrid = (size: number, h: Coordinate, t: Coordinate) => {
  const lines = [];
  for(let y = 0; y < size; y++) {
    let line = '';
    for(let x = 0; x < size; x++) {
      const isHead = x === h[0] && y === h[1];
      const isTail = x === t[0] && y === t[1];
      line += isHead && isTail ? 'x' : isHead ? 'H' : isTail ? 'T' : '.';
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
  let h: Coordinate = [0, 0];
  let t: Coordinate = [0, 0];
  let printSize = 5;

  if (DEBUG) {
    console.log(`start`);
    printGrid(printSize, h, t);
  }

  movements.forEach((movement) => {
    for(let i = 0; i < movement.distance; i++) {
      h = traverse(h, DirectionFlippedVert[movement.direction]);
      t = moveTail(h, t);
      visited.add(`${t[0]},${t[1]}`);

      if (DEBUG) {
        printSize = Math.max(printSize, h[0] + 1, h[1] + 1);
        console.log(`\n${movement.direction}`);
        printGrid(printSize, h, t);
      }
    }
  });

  if (DEBUG) {
    console.log(`\nvisited:`);
    printVisited(printSize, visited);
  }

  return visited.size;
}