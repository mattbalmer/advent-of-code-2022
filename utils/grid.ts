import { toInt } from '@utils/numbers';

export enum DIR {
  UP = 'UP',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
}

export type Grid <T extends any = unknown> = {
  cells: T[],
  width: number,
  height: number,
}

export type Coordinate = [x: number, y: number];

export const Traversals: Record<DIR, Coordinate> = {
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
  UP: [0, -1]
};

export const traverse = ([col, row]: Coordinate, dir: DIR, distance: number = 1): Coordinate => {
  return [
    col + (Traversals[dir][0] * distance),
    row + (Traversals[dir][1] * distance),
  ];
}

export const coordsMatch = (a: Coordinate, b: Coordinate): boolean =>
  a[0] === b[0] && a[1] === b[1];

export const distanceCardinal = (from: Coordinate, to: Coordinate): number =>
  Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]);

export const coordToString = (coordinate: Coordinate): string =>
  `${coordinate[0]},${coordinate[1]}`;

export const coordFromString = (coordinate: string): Coordinate =>
  coordinate.split(',').map(toInt) as Coordinate;

export const getDir = (a: Coordinate, b: Coordinate): DIR => {
  const t: Coordinate = [
    Math.sign(b[0] - a[0]),
    Math.sign(b[1] - a[1]),
  ];
  const i = Object.values(Traversals).findIndex((_) => coordsMatch(t, _));
  return Object.keys(Traversals)[i] as DIR;
}

export const getCell = <T extends any = unknown>(grid: Grid<T>, [col, row]: Coordinate): T => {
  return grid.cells[col + grid.width * row];
}

export const isValidCoordinate = (grid: Grid, [x, y]: Coordinate) =>
  x >= 0 && x < grid.width && y >= 0 && y < grid.height;

export const coordsForIndex = (grid: Grid, i: number): Coordinate =>
  [i % grid.width, Math.floor(i / grid.width)];
