import { mult } from '@utils/array';

export type Operation = (old: number) => number;
type Targets = [onTrue: number, onFalse: number];
export type Monkey = {
  number: number,
  items: number[],
  operation: Operation,
  divisor: number,
  targets: Targets,
  inspections: number,
}

export const getMonkey = (monkeys: Monkey[], number: number): Monkey =>
  monkeys.find((monkey) =>
    monkey.number === number
  );

const getTarget = (targets: Targets, isDivisible: boolean): number =>
  targets[isDivisible ? 0 : 1];

const addItem = (monkey: Monkey, item: number): void => {
  monkey.items.push(item);
}

const yeetItem = (monkeys: Monkey[], monkey: Monkey, item: number, op: Operation): void => {
  const newWorryLevel = op(monkey.operation(item));
  const isDivisible = newWorryLevel % monkey.divisor === 0;

  addItem(
    getMonkey(monkeys,
      getTarget(monkey.targets, isDivisible)
    ),
    newWorryLevel
  );
}

export const performTurn = (monkeys: Monkey[], activeMonkey: Monkey, op: Operation): void => {
  activeMonkey.items.forEach((item) => {
    yeetItem(monkeys, activeMonkey, item, op);
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