import { mult } from '@utils/array';

export type Operation = (old: number) => number;

export type Monkey = {
  number: number,
  items: number[],
  operation: Operation,
  divisor: number,
  targets: [onTrue: number, onFalse: number],
  inspections: number,
}

export const getMonkey = (monkeys: Monkey[], number: number): Monkey =>
  monkeys.find((monkey) =>
    monkey.number === number
  );

export const performTurn = (monkeys: Monkey[], activeMonkey: Monkey, op: Operation): void => {
  activeMonkey.items.forEach((item) => {
    const newWorryLevel = op(activeMonkey.operation(item));
    const result = newWorryLevel % activeMonkey.divisor === 0;
    const target = activeMonkey.targets[result ? 0 : 1];
    getMonkey(monkeys, target).items.push(newWorryLevel);
  });
  activeMonkey.inspections += activeMonkey.items.length;
  activeMonkey.items = [];
}

export const performRound = (monkeys: Monkey[], op: Operation): void => {
  monkeys.forEach((monkey) => {
    performTurn(monkeys, monkey, op);
  });
}

export const getMostActiveMonkeys = (monkeys: Monkey[], count: number): Monkey[] =>
  monkeys
    .sort((a, b) => b.inspections - a.inspections)
    .slice(0, count);

export const getMonkeyBusinessLevel = (monkeys: Monkey[]): number =>
  mult(
    monkeys.map((monkey) =>
      monkey.inspections
    )
  );

export const main = (monkeys: Monkey[], rounds: number, op: Operation): number => {
  for(let round = 0; round < rounds; round++) {
    performRound(monkeys, op);
  }

  return getMonkeyBusinessLevel(
    getMostActiveMonkeys(monkeys, 2)
  );
}