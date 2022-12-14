import { Cave, CaveValue } from './shared';
import { coordToString } from '@utils/grid';

const BUFFER_X = 2;
const BUFFER_Y = 2;

const REP: Record<CaveValue, string> = {
  ['rock']: '#',
  ['sand']: '*',
  ['cliff']: '~',
  ['source']: '+',
}

export const caveToString = (cave: Cave): string => {
  const {
    x: [minX, maxX],
    y: [minY, maxY],
  } = cave.bounds;

  let output = '';
  for(let y = minY - BUFFER_Y; y < maxY + BUFFER_Y; y++) {
    for(let x = minX - BUFFER_X; x < maxX + BUFFER_X; x++) {
      const value = cave.map[coordToString([x, y])];

      const str = REP[value] || ' ';
      output += str;
    }

    output += '\n';
  }

  return output;
}