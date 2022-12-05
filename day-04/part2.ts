import { Execute, Group } from './format';
import { sum } from '@utils/array';

const hasOverlap = (elves: Group): boolean => {
  const outerSign = Math.sign(elves[0][0] - elves[1][1]);
  const innerSign = Math.sign(elves[0][1] - elves[1][0]);
  return Math.abs(outerSign + innerSign) <= 1;
}

export const execute: Execute = (groups) => {
  return sum(
    groups.map(group => hasOverlap(group) ? 1 : 0)
  );
}