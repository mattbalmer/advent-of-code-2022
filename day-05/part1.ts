import { Execute, Stacks } from './format';
import { Instruction, Stack } from './shared';
import { last } from '@utils/array';

const performInstruction = (stacks: Stacks, instruction: Instruction): Stacks => {
  const [from, to, count] = instruction;

  for (let i = 0; i < count; i++) {
    const crate = stacks[from].pop();
    stacks[to].push(crate);
  }

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