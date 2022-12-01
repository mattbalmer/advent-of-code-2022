import { Execute } from './format';

export const execute: Execute = (elves) => {
  const totals = elves
    .map((food) => food
      .reduce((sum, calories) => sum + calories, 0)
    )
    .sort((a, b) => b - a);
  return totals[0];
}