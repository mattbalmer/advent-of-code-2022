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

export const Traversals: Record<DIR, [col: number, row: number]> = {
  DOWN: [0, 1],
  LEFT: [-1, 0],
  RIGHT: [1, 0],
  UP: [0, -1]
};

export const getCell = <T extends any = unknown>(grid: Grid<T>, [col, row]: [number, number]): T => {
  return grid.cells[col + grid.length * row];
}

export const traverse = ([col, row]: [number, number], dir: DIR): [number, number] => {
  return [
    col + Traversals[dir][0],
    row + Traversals[dir][1],
  ];
}
