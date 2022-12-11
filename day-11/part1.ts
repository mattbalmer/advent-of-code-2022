import { Execute } from './format';
import { main } from './shared';

const ROUNDS = 20;

export const execute: Execute = (monkeys) => {
  const op = (item: number) => Math.floor(item / 3);

  return main(monkeys, ROUNDS, op);
}