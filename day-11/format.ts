import { Monkey } from './shared';
import { toInt } from '@utils/numbers';

const monkeyregex = () => new RegExp(`Monkey (\\d+):
  Starting items: ([\\d,\\s]+)
  Operation: new = (.*?)
  Test: divisible by (\\d+)
    If true: throw to monkey (\\d+)
    If false: throw to monkey (\\d+)`, 'gm');

const parseMonkey = (description: string): Monkey => {
  const [, number_, items_, operation_, divisor_, onTrue_, onFalse_] = monkeyregex().exec(description) || [];
  const [number, divisor, onTrue, onFalse] = [number_, divisor_, onTrue_, onFalse_].map(toInt);
  const items = items_.split(', ').map(toInt);

  // maybe do this more 'intended' way later. Cheat for now
  const operation = (old: number): number => eval(operation_);

  const test = (item: number) => item % divisor === 0;

  return {
    number,
    items,
    operation,
    test,
    targets: [onTrue, onFalse],
    inspections: 0,
  }
}

export type Execute = (monkeys: Monkey[]) => number;
export const format = (raw: string): Parameters<Execute> => {
  return [
    raw.split('\n\n')
      .map(parseMonkey)
  ];
}