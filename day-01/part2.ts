import { Execute } from './format';
import { sum } from '@utils/array';

export const execute: Execute = (elves) => {
  const totals = elves
    .map((food) => sum(food))
    .sort((a, b) => b - a);
  return sum(totals.slice(0, 3));
}