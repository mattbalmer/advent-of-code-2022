import chalk from 'chalk';
import { Coordinate, DIR, getCell, Grid, isValidCoordinate, traverse } from '@utils/grid';
import { generate } from '@utils/array';
import { ALPHABET } from '@utils/strings';

export type StackEntry = {
  coordinate: Coordinate,
  elevation: number,
  distance: number,
  score: number,
  path: Coordinate[],
};

export const getElevation = (char: string): number =>
  ALPHABET.indexOf(
    char
      .replace('S', 'a')
      .replace('E', 'z')
  );

export const getAdjacent = (grid: Grid, coordinate: Coordinate): Coordinate[] => {
  return Object.keys(DIR)
    .map((dir: DIR) => traverse(coordinate, dir))
    .filter((coordinate) => isValidCoordinate(grid, coordinate));
}

const colorFor = (elevation: number): ReturnType<typeof chalk.rgb> => {
  const ePct = Math.log(elevation + 1) / Math.log(27);
  return chalk.rgb(
    255 * (1 - ePct),
    50,
    255 * ePct
  );
}

const gridToString = (grid: Grid<string>) => {
  return generate(grid.height,
    (y) => generate(grid.width, (x) => {
      const cell = getCell(grid, [x, y]);
      return colorFor(getElevation(cell))(cell);
    }).join('')
  ).join('\n');
}

export const pathToString = (grid: Grid<string>, path: Coordinate[]) => {
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

    const cell = getCell(grid, [x, y]);
    const elevation = getElevation(cell);

    lines[y][x] = colorFor(elevation)
      .bold
      .bgRgb(100, 100, 100)
      (cell);
  }

  return lines
    .map(line =>
      line.join('')
    )
    .join('\n');
}
