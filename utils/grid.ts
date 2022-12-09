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
