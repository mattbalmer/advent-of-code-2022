import { Execute } from './format';
import { Monkey } from './shared';

const ROUNDS = 20;

const getMonkey = (monkeys: Monkey[], number: number): Monkey =>
  monkeys.find((monkey) =>
    monkey.number === number
  );

const performTurn = (monkeys: Monkey[], activeMonkey: Monkey): void => {
  activeMonkey.items.forEach((item) => {
    const newWorryLevel = Math.floor(
      activeMonkey.operation(item) / 3
    );
    // const result = activeMonkey.test(newWorryLevel);
    const result = newWorryLevel % activeMonkey.divisor === 0;
    const target = activeMonkey.targets[result ? 0 : 1];
    getMonkey(monkeys, target).items.push(newWorryLevel);
  });
  activeMonkey.inspections += activeMonkey.items.length;
  activeMonkey.items = [];
}

const performRound = (monkeys: Monkey[]): void => {
  monkeys.forEach((monkey) => {
    performTurn(monkeys, monkey);
  });
}

export const execute: Execute = (monkeys) => {
  for(let round = 0; round < ROUNDS; round++) {
    performRound(monkeys);
  }

  const mostActiveMonkeys = monkeys
    .sort((a, b) => b.inspections - a.inspections)
    .slice(0, 2);

  return mostActiveMonkeys
    .reduce((product, monkey) =>
      product * monkey.inspections,
      1
    );
}