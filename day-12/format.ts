import { Coordinate, Grid } from '@utils/rect-grid';

export type Execute = (grid: Grid<string>) => number;

export const format = (raw: string): Parameters<Execute> => {
  const lines = raw.split('\n').filter(line => Boolean(line));

  return [
    {
      cells: lines.join('').split(''),
      width: lines[0].length,
      height: lines.length,
    }
  ];
}