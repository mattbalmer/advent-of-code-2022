import { Execute } from './format';
import {
  Coordinate,
  coordsForIndex,
  coordsMatch,
  coordToString,
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

const pathBetween = (grid: Grid<string>, start: Coordinate, finalElevation: number): Coordinate[] => {
  const toEntry = (coordinate: Coordinate, path: Coordinate[]): StackEntry => {
    const elevation = getElevation(getCell(grid, coordinate));
    const score = elevation;

    return {
      coordinate,
      score,
      elevation,
      distance: -1,
      path: [...path, coordinate],
    }
  }

  let stack: StackEntry[] = [
    toEntry(start, []),
  ];

  log('all', () => [
    `Initial`,
    start,
    JSON.stringify(stack, null, 2),
  ]);

  while (stack.length > 0) {
    const {
      coordinate: from,
      elevation,
      path,
      score: fromScore,
    } = stack.shift();

    if (elevation === finalElevation) {
      log(() => [
        `Exit found ${path.length}`,
        path.map(coordToString).join(' -> ')
      ]);
      return path;
    }

    const adjacent = getAdjacent(grid, from)
      .map((entry) => toEntry(entry, path))
      .filter((adjacent) =>
        elevation - adjacent.elevation <= 1
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
  const start = coordsForIndex(grid, grid.cells.indexOf('E'));
  const path = pathBetween(grid, start, getElevation('S'));

  log('all', () => [
    'path:',
    `\n${pathToString(grid, path)}`
  ]);

  return path.length - 1;
}