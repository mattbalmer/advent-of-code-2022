import { Execute } from './format';
import {
  Coordinate,
  coordsForIndex,
  coordsMatch,
  coordToString,
  distanceCardinal,
  getCell,
  Grid,
} from '@utils/grid';
import { binaryInsert, strip } from '@utils/array';
import { log } from '@utils/debug';
import { getAdjacent, getElevation, pathToString, StackEntry } from './shared';

const BestFrom = new Map<string, {
  score: number,
  from: Coordinate,
}>();

const pathBetween = (grid: Grid<string>, start: Coordinate, to: Coordinate): Coordinate[] => {
  const finalElevation = getElevation(getCell(grid, to));

  const toEntry = (coordinate: Coordinate, path: Coordinate[]): StackEntry => {
    const elevation = getElevation(getCell(grid, coordinate));
    const distance = distanceCardinal(coordinate, to);
    const elevationDiff = (finalElevation - elevation + 1);

    const score = distance + (elevationDiff / 10); // + (dirScore / 100);

    return {
      coordinate,
      score,
      elevation,
      distance,
      path: [...path, coordinate],
    }
  }

  let stack: StackEntry[] = [
    toEntry(start, []),
  ];

  while (stack.length > 0) {
    const {
      coordinate: from,
      elevation,
      path,
      score: fromScore,
    } = stack.shift();

    if (coordsMatch(from, to)) {
      return path;
    }

    const adjacent = getAdjacent(grid, from)
      .map((entry) => toEntry(entry, path))
      .filter((adjacent) =>
        adjacent.elevation - elevation <= 1
      );

    if (adjacent.length < 1) {
      log(() => `No valid adjacent cells at ${coordToString(from)}`);
      continue;
    }

    adjacent
      .sort((a, b) => a.score - b.score)
      .forEach((entry) => {
        const coordString = coordToString(entry.coordinate);
        const score = entry.score + fromScore;

        const insertEntry = () => {
          stack = binaryInsert(
            stack,
            {
              ...entry,
              score,
            },
            (entry) => entry.score
          );
        }

        // If this path is better than the previous best from this coordinate - add to stack
        // If this path has not been traversed before - add to stack
        // Else - ignore
        if (BestFrom.has(coordString)) {
          const bestFrom = BestFrom.get(coordString);
          if (score < bestFrom.score) {
            const existingI = stack.findIndex((e) => coordsMatch(e.coordinate, entry.coordinate));
            if (existingI > -1) {
              stack = strip(stack, existingI, 1);
            }
            BestFrom.set(coordString, {
              score: score,
              from,
            });
            insertEntry();
          }
        } else {
          BestFrom.set(coordString, {
            score: score,
            from,
          });
          insertEntry();
        }
      });
  }

  return null;
}

export const execute: Execute = (grid) => {
  const start = coordsForIndex(grid, grid.cells.indexOf('S'));
  const end = coordsForIndex(grid, grid.cells.indexOf('E'));

  const path = pathBetween(grid, start, end);

  log('all', () => [
    'path:',
    `\n${pathToString(grid, path)}`
  ]);

  return path.length - 1;
}