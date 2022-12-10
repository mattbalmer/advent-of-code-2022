import { Execute } from './format';
import { log, printWithAnswer } from '@utils/debug';
import { Instruction, InstructionDuration, narrowInstruction, toInstruction } from './shared';

export const execute: Execute = (lines) => {
  const userInstructions = lines.map(toInstruction);
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

        log(() => [
          // @ts-ignore
          cycle, '->', popCycle, newInstruction.type, newInstruction.value
        ]);

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
    signals.push(cycle * X);

    const instructionsForTick = instructions.shift() || [];

    instructionsForTick.map((instruction) => {
      if (narrowInstruction(instruction, 'addx')) {
        X += instruction.value;
      }
      log(() => [
        // @ts-ignore
        cycle, '+', instruction.type, instruction.value, X
      ]);
    });

    cycle += 1;
    i = (cycle - 1) % ROW_LEN;
  }

  const image = output.join('\n');
  printWithAnswer('image', image);

  return image;
}