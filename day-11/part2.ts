import { Execute } from './format';
import { main } from './shared';
import { mult } from '@utils/array';

const ROUNDS = 10_000;

export const execute: Execute = (monkeys) => {
  const lcm = mult(
    monkeys.map((monkey) => monkey.divisor)
  );

  const op = (item: number) => item % lcm;

  return main(monkeys, ROUNDS, op);
}