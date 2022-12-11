import { Execute } from './format';
import { Monkey } from './shared';
import { log } from '@utils/debug';
import { mult } from '@utils/array';

const ROUNDS = 10_000;

const logMonkeys = (monkeys: Monkey[]): void => {
  log(() => [
    monkeys.map(({
      number,
      inspections,
      items,
      divisor,
    }) => ({
      number,
      inspections,
      items,
      divisor,
    }))
  ]);
}

const getMonkey = (monkeys: Monkey[], number: number): Monkey =>
  monkeys.find((monkey) =>
    monkey.number === number
  );

const performTurn = (monkeys: Monkey[], activeMonkey: Monkey, divisorProduct: number): void => {
  activeMonkey.items.forEach((item) => {
    const newWorryLevel = activeMonkey.operation(item);
    const isDivisible = newWorryLevel % activeMonkey.divisor === 0;
    const target = activeMonkey.targets[isDivisible ? 0 : 1];
    getMonkey(monkeys, target).items.push(newWorryLevel % divisorProduct);
  });
  activeMonkey.inspections += activeMonkey.items.length;
  activeMonkey.items = [];
}

const performRound = (monkeys: Monkey[], divisorProduct: number): void => {
  monkeys.forEach((monkey) => {
    performTurn(monkeys, monkey, divisorProduct);
  });
}

export const execute: Execute = (monkeys) => {
  const LOG_ROUNDS = [
    0,
    20,
    1000
  ];

  const divisorProduct = mult(
    monkeys.map((monkey) => monkey.divisor)
  );

  for(let round = 0; round < ROUNDS; round++) {
    performRound(monkeys, divisorProduct);

    if (LOG_ROUNDS.includes(round)) {
      log(() => [`\nRound ${round}:`])
      logMonkeys(monkeys);
    }
  }

  logMonkeys(monkeys);

  const mostActiveMonkeys = monkeys
    .sort((a, b) => b.inspections - a.inspections)
    .slice(0, 2);

  return mult(
    mostActiveMonkeys.map((monkey) => monkey.inspections)
  );
}