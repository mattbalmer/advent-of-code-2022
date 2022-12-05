export type Stack = number;
export type Crate = string;
export type Instruction = [
  from: Stack,
  to: Stack,
  count: number,
];