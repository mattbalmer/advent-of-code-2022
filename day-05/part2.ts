import { Execute, Stacks } from './format';
import { Instruction } from './shared';
import { last } from '@utils/array';

const performInstruction = (stacks: Stacks, instruction: Instruction): Stacks => {
  const [from, to, count] = instruction;

  const crates = stacks[from].splice(stacks[from].length - count, count);
  stacks[to] = [
    ...stacks[to],
    ...crates,
  ];

  return stacks;
};

export const execute: Execute = (stacks, instructions) => {
  const finalStacks = instructions.reduce((stacks, instruction) =>
      performInstruction(stacks, instruction),
    stacks
  );

  return Object.values(finalStacks)
    .reduce((message, stack) => {
      return `${message}${last(stack)}`
    }, '');
}