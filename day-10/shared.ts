export type InstructionType = 'noop' | 'addx';
export type Instruction<Type = InstructionType> = {
  type: Type,
} & (Type extends 'addx' ? {
  value: number
} : {});

export const narrowInstruction =
  <T extends Instruction['type']>
  (instruction: Instruction, type: T):
  instruction is Instruction<T> =>
    instruction.type === type;

export const InstructionDuration: Record<InstructionType, number> = {
  'noop': 1,
  'addx': 2,
};

const Parsers: {
  [T in InstructionType]: (...args: string[]) => Omit<Instruction<T>, 'type'>;
} = {
  'noop': () => ({}),
  'addx': (value) => ({
    value: parseInt(value, 10),
  }),
};

export const toInstruction = (input: string): Instruction => {
  const [type, ...args] = input.split(' ');

  const fields = Parsers[type](...args);

  return {
    type,
    ...fields,
  }
}