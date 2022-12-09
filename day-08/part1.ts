import { Execute } from './format';
import { DIR, getCell, Grid, traverse } from '@utils/grid';

const isTreeVisibleFromDirection = (grid: Grid<number>, [col, row], dir: DIR): boolean => {
  const original = getCell(grid, [col, row]);

  [col, row] = traverse([col, row], dir);

  while (row >= 0 && row < grid.length && col >= 0 && col < grid.length) {
    const test = getCell(grid, [col, row]);

    if (test >= original) {
      return false;
    }

    [col, row] = traverse([col, row], dir);
  }

  return true;
}

export const execute: Execute = (grid) => {
  const outerCount = (grid.length - 1) * 4;
  let innerCount = 0;

  for(let row = 1; row < grid.length - 1; row++) {
    for(let col = 1; col < grid.length - 1; col++) {
      const isVisibleFromAnyDirection = Object
        .keys(DIR)
        .some((dir: DIR) => isTreeVisibleFromDirection(grid, [col, row], dir));

      if (isVisibleFromAnyDirection) {
        innerCount += 1;
      }
    }
  }

  const allesMiKopeng = outerCount + innerCount;

  return allesMiKopeng;
}