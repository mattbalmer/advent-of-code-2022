import { Coordinate } from '@utils/grid';
import { toInt } from '@utils/numbers';

export type Execute = (paths: Coordinate[][]) => number;
export const format = (raw: string): Parameters<Execute> => {
  return [
    raw.split('\n')
      .map((line) =>
        line.split(' -> ')
          .map((segment) =>
            segment.split(',')
              .map(toInt) as Coordinate
          )
      ),
  ];
}