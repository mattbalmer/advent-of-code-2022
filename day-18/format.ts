import { linesInFile } from '@utils/strings';
import { toInt } from '@utils/numbers';

export enum Axis {
  x = 'x',
  y = 'y',
  z = 'z',
}
export type Face<A extends Axis | unknown = unknown> = {
  axis: A,
  x: A extends Axis.x ? [number, number] : number,
  y: A extends Axis.y ? [number, number] : number,
  z: A extends Axis.z ? [number, number] : number,
};
export type Coordinate3D = [x: number, y: number, z: number];

export type Execute = (lines: Coordinate3D[]) => number;
export const format = (raw: string): Parameters<Execute> => {
  return [
    linesInFile(raw)
      .map((line) =>
        line.split(',')
          .map(toInt) as Coordinate3D,
      ),
  ];
}