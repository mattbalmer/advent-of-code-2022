import { toInt } from '@utils/numbers';

export enum DIR {
  UP = 'UP',
  RIGHT = 'RIGHT',
  DOWN = 'DOWN',
  LEFT = 'LEFT',
}

export type Grid <T extends any = unknown> = {
  cells: T[],
  length: number,
}

export type Coordinate = [x: number, y: number];

export const Traversals: Record<DIR, Coordinate> = {
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
  UP: [0, -1]
};

export const getCell = <T extends any = unknown>(grid: Grid<T>, [col, row]: Coordinate): T => {
  return grid.cells[col + grid.length * row];
}

export const traverse = ([col, row]: Coordinate, dir: DIR, distance: number = 1): Coordinate => {
  return [
    col + (Traversals[dir][0] * distance),
    row + (Traversals[dir][1] * distance),
  ];
}

export const isValidCoordinate = (grid: Grid, [x, y]: Coordinate) =>
  x >= 0 && x < grid.length && y >= 0 && y < grid.length;

export const coordsMatch = (a: Coordinate, b: Coordinate): boolean =>
  a[0] === b[0] && a[1] === b[1];

export const coordsForIndex = (grid: Grid, i: number): Coordinate =>
  [i % grid.length, Math.floor(i / grid.length)];

export const distanceCardinal = (from: Coordinate, to: Coordinate): number =>
  Math.abs(to[0] - from[0]) + Math.abs(to[1] - from[1]);

export const coordToString = (coordinate: Coordinate): string =>
  `${coordinate[0]},${coordinate[1]}`;

export const coordFromString = (coordinate: string): Coordinate =>
  coordinate.split(',').map(toInt) as Coordinate;