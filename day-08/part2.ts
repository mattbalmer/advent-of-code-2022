import { Execute } from './format';
import { DIR, getCell, Grid, traverse } from '@utils/grid';

const getDistanceUntilBlocked = (grid: Grid<number>, [col, row], dir: DIR): number => {
  const original = getCell(grid, [col, row]);
  let distance = 0;

  [col, row] = traverse([col, row], dir);

  while (row >= 0 && row < grid.length && col >= 0 && col < grid.length) {
    const test = getCell(grid, [col, row]);
    distance += 1;

    if (test >= original) {
      break;
    }

    [col, row] = traverse([col, row], dir);
  }

  return distance;
}

export const execute: Execute = (grid) => {
  let highestScenicScore = 0;

  for(let row = 1; row < grid.length - 1; row++) {
    for(let col = 1; col < grid.length - 1; col++) {
      const scenicScore = Object
        .keys(DIR)
        .reduce((score, dir: DIR) =>
          score * getDistanceUntilBlocked(grid, [col, row], dir),
          1
        );

      highestScenicScore = Math.max(scenicScore, highestScenicScore);
    }
  }


  return highestScenicScore;
}