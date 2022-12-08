export type Grid <T extends any = unknown> = {
  cells: T[],
  length: number,
}

export const getCell = <T extends any = unknown>(grid: Grid<T>, [col, row]: [number, number]): T => {
  return grid.cells[col + grid.length * row];
}