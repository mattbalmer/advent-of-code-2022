import { Crate, Instruction, Stack } from './shared';
import rfdc from '@utils/rfdc';

const isStringOnlyNumbersAndSpaces = (str: string): boolean =>
  str && (/^(\d+)$/).test(str.replaceAll(' ', ''));

const getNumbersInString = (str: string): number[] =>
  str.match(/(\d+)/g)
    .map(str => parseInt(str, 10));

const getCratesInString = (str: string, stackCount: number): string[] => {
  const crates = [];
  for(let s = 0; s < stackCount; s++) {
    const i = s * 4 + 1;
    const letter = str.length >= i ? str[i].replace(' ', '') : null;
    crates.push(letter);
  }
  return crates;
}

const toInstruction = (str: string): Instruction => {
  const [count, from, to] = (/move (\d+) from (\d+) to (\d+)/g).exec(str).slice(1)
    .map((str) => parseInt(str, 10));

  return [from, to, count];
}

export type Stacks = Record<Stack, Crate[]>;
export type Execute = (stacks: Stacks, instructions: Instruction[]) => string;
export const format = (raw: string): Parameters<Execute> => {
  const stacks: Stacks = {};

  const lines = raw.split('\n');
  const crateLabelsIndex = lines.findIndex(isStringOnlyNumbersAndSpaces);

  getNumbersInString(lines[crateLabelsIndex])
    .forEach((crateLabel) => stacks[crateLabel] = []);

  const stackCount = Object.keys(stacks).length;

  // Add crates to stacks
  lines.slice(0, crateLabelsIndex).forEach((line) => {
    getCratesInString(line, stackCount)
      .forEach((crate, i) => {
        if (!crate) {
          return;
        }
        const stack = i + 1;
        stacks[stack] = [
          crate,
          ...stacks[stack],
        ];
      })
  });

  const instructions = lines.slice(crateLabelsIndex + 2)
    .filter(line => Boolean(line))
    .map(toInstruction);

  return rfdc([
    stacks,
    instructions,
  ]);
}