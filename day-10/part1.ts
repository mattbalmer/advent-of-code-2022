import { Execute } from './format';
import { sum } from '@utils/array';

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
  let cycle = 1;
  let X = 1;
  const signals = [];

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

    if (shouldAddSignal(cycle)) {
      // console.log('adding signal', cycle, X, cycle * X, signals);
      signals.push(cycle * X);
    }

    const instructionsForTick = instructions.shift() || [];

    instructionsForTick.map((instruction) => {
      if (instruction.type === 'addx') {
        X += (instruction as Instruction<'addx'>).value;
      }
      // @ts-ignore
      // console.log(cycle, '+', instruction.type, instruction.value, X);
    });

    cycle += 1;
  }

  // console.log('signals', signals);

  return sum(signals);
}