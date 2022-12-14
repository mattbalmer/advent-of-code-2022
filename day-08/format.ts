import { Grid } from '@utils/grid';

export type Execute = (grid: Grid<number>) => number;
export const format = (raw: string): Parameters<Execute> => {
  const lines = raw.split('\n').filter(line => Boolean(line));
  const cells = lines.join('').split('').map(cell => parseInt(cell, 10));
  const { length } = lines;
  return [
    {
      cells,
      width: length,
      height: length,
    }
  ];
}