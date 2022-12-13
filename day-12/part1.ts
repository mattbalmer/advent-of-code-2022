import { Execute } from './format';
import {
  Coordinate,
  coordsForIndex,
  coordsMatch, coordToString,
  DIR, distanceCardinal, getCell, getDir,
  Grid,
  isValidCoordinate,
  traverse
} from '@utils/rect-grid';
import { ALPHABET } from '@utils/strings';
import { binaryInsert, generate, strip } from '@utils/array';
import { log } from '@utils/debug';
import chalk from 'chalk';

type StackEntry = {
  coordinate: Coordinate,
  elevation: number,
  distance: number,
  score: number,
  path: Coordinate[],
};

const getElevation = (char: string): number =>
  ALPHABET.indexOf(
    char
      .replace('S', 'a')
      .replace('E', 'z')
  );

const getAdjacent = (grid: Grid, coordinate: Coordinate): Coordinate[] => {
  return Object.keys(DIR)
    .map((dir: DIR) => traverse(coordinate, dir))
    .filter((coordinate) => isValidCoordinate(grid, coordinate));
}

const BestFrom = new Map<string, {
  score: number,
  from: Coordinate,
}>();

const pathBetween = (grid: Grid<string>, start: Coordinate, to: Coordinate): Coordinate[] => {
  const finalElevation = getElevation(getCell(grid, to));

  const toEntry = (coordinate: Coordinate, path: Coordinate[]): StackEntry => {
    const elevation = getElevation(getCell(grid, coordinate));
    const distance = distanceCardinal(coordinate, to);
    const elevationScore = (finalElevation - elevation + 1);
    const distanceScore = distance;
    // const score = elevationScore + distanceScore;

    const oneCellAgo = path[path.length - 1];
    const twoCellsAgo = path[path.length - 2];
    let dirScore = 1;
    if (oneCellAgo && twoCellsAgo) {
      const previousMove = getDir(twoCellsAgo, oneCellAgo);
      const thisMove = getDir(oneCellAgo, coordinate);
      if (previousMove === thisMove) {
        dirScore = 0;
      }
    }

    const score = distanceScore + (elevationScore / 10); // + (dirScore / 100);

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

  log('all', () => [
    `Initial`,
    start,
    to,
    JSON.stringify(stack, null, 2),
  ]);

  while (stack.length > 0) {
    const {
      coordinate: from,
      elevation,
      path,
      score: fromScore,
    } = stack.shift();
    // if (path.length < 10) {
    //   log('all', () => `Evaluating ${from}`);
    // }

    if (coordsMatch(from, to)) {
      log(() => [
        `Exit found ${path.length}`,
        path.map(coordToString).join(' -> ')
      ]);
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
    } else {
      log(() => [
        `adjacent to ${coordToString(from)}`,
        adjacent.map((a) => ({
          ...a,
          path: a.path.length,
        })),
      ]);
    }

    adjacent
      .sort((a, b) => a.score - b.score)
      .forEach((entry) => {
        log(() => [
          `Adding cell to stack`,
          JSON.stringify({
            ...entry,
            path: path.length,
          }, null, 2),
        ]);
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
          // stack.push(entry);
          // if (path.length < 10) {
          //   log('all', () => [
          //     stack.map((e) => e.score)
          //   ])
          // }
        }

        // If this path is better than the previous best from this coordinate - add to stack
        // If this path has not been traversed before - add to stack
        // Else - ignore
        if (BestFrom.has(coordString)) {
          const bestFrom = BestFrom.get(coordString);
          if (score < bestFrom.score) {
            // log('all', () => [`better score for ${coordString} : ${entry.score}`]);
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
          // if (path.length < 10) {
          //   log('all', () => [`first score for ${coordString} : ${score}`]);
          // }
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

const colorFor = (elevation: number, isPath: boolean = false): ReturnType<typeof chalk.rgb> => {
  // const ePct = elevation / 26;
  const ePct = Math.log(elevation + 1) / Math.log(27);
  const color: [number, number, number] = [
    255 * (1 - ePct),
    // isPath ? 200 : 50,
    50,
    255 * ePct,
  ];

  return chalk.rgb(...color);
  // if (isPath) {
  //   return chalk.rgb(...color).bold;
  // } else {
  //   return chalk.rgb(...color);
  // }
}

const gridToString = (grid: Grid<string>) => {
  let lines = [];
  for(let y = 0; y < grid.height; y++) {
    let line = '';
    for(let x = 0; x < grid.width; x++) {
      const cell = getCell(grid, [x, y]);

      const elevation = getElevation(cell);
      line += colorFor(elevation)(cell);
    }
    lines.push(line);
  }
  return lines.join('\n');
}

const pathToString = (grid: Grid<string>, path: Coordinate[]) => {
  let lines = generate(grid.height,
    (y) => generate(grid.width, (x) => {
      const cell = getCell(grid, [x, y]);
      return colorFor(getElevation(cell))(cell);
    })
  );

  for(let i = 0; i < path.length; i++) {
    const [x, y] = path[i];
    const next = path[i + 1];
    if (!next) {
      lines[y][x] = 'E';
      continue;
    }

    const dirTo = getDir([x, y], next);
    const cell = getCell(grid, [x, y]);
    const elevation = getElevation(cell);

    const value = {
      [DIR.UP]: '^',
      [DIR.DOWN]: 'v',
      [DIR.LEFT]: '<',
      [DIR.RIGHT]: '>',
    }[dirTo];

    // const str = colorFor(elevation, true)(value || cell);
    const str = colorFor(elevation, true)
      .bold
      .bgRgb(100, 100, 100)
      (cell);

    lines[y][x] = str;
  }

  return lines.map(line => line.join('')).join('\n');
}

export const execute: Execute = (grid) => {
  // log('all', () => [
  //   gridToString(grid)
  // ]);

  const start = coordsForIndex(grid, grid.cells.indexOf('S'));
  const end = coordsForIndex(grid, grid.cells.indexOf('E'));

  const path = pathBetween(grid, start, end);

  // log(() => path);
  log('all', () => [
    'path:',
    `\n${pathToString(grid, path)}`
  ]);

  return path.length - 1;
}