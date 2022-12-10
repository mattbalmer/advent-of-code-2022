import { Execute } from './format';
import { sum } from '@utils/array';
import { printWithAnswer } from '@utils/debug';

type InstructionType = 'noop' | 'addx';
type Instruction<Type = InstructionType> = {
  type: Type,
} & (Type extends 'addx' ? {
  value: number
} : {});

const InstructionDuration: Record<InstructionType, number> = {
  'noop': 1,
  'addx': 2,
};

const toUserInstruction = (string: string): Instruction => {
  const [type, ...args] = string.split(' ');

  const fields = {
    'noop': () => ({}),
    'addx': (value) => ({
      value: parseInt(value, 10),
    }),
  }[type](...args);

  return {
    type,
    ...fields,
  }
}

const shouldAddSignal = (cycle: number): boolean => (cycle - 20) % 40 === 0;

export const execute: Execute = (lines) => {
  const userInstructions = lines.map(toUserInstruction);
  const instructions: Instruction[][] = [];
  const ROW_LEN = 40;
  const SPRITE_WIDTH = 3;
  const MAX_DIST = (SPRITE_WIDTH - 1) / 2;
  let cycle = 1;
  let X = 1;
  const signals = [];
  let i = 0;
  let output = [];

  while(instructions.length > 0 || userInstructions.length > 0) {
    if (instructions.length === 0) {
      const newInstruction = userInstructions.shift();
      if (newInstruction) {
        const delay = InstructionDuration[newInstruction.type];
        const popCycle = delay - 1;
        // @ts-ignore
        // console.log(cycle, '->', popCycle, newInstruction.type, newInstruction.value);

        if (!instructions[popCycle]) {
          instructions[popCycle] = [];
        }
        instructions[popCycle].push(newInstruction);
      }
    }

    const isVisible = Math.abs(X - i) - MAX_DIST <= 0;
    const value = isVisible ? '#' : ' ';
    let row = Math.floor((cycle - 1) / ROW_LEN);
    output[row] = (output[row] || '') + value;
    // console.log('adding signal', cycle, X, cycle * X, signals);
    signals.push(cycle * X);

    const instructionsForTick = instructions.shift() || [];

    instructionsForTick.map((instruction) => {
      if (instruction.type === 'addx') {
        X += (instruction as Instruction<'addx'>).value;
      }
      // @ts-ignore
      // console.log(cycle, '+', instruction.type, instruction.value, X);
    });

    cycle += 1;
    i = (cycle - 1) % ROW_LEN;
  }

  // console.log('signals', signals);

  const image = output.join('\n');
  printWithAnswer('image', image)

  return image;
}