export type Monkey = {
  number: number,
  items: number[],
  operation: (old: number) => number,
  // test: (item: number) => boolean,
  divisor: number,
  targets: [onTrue: number, onFalse: number],
  inspections: number,
}