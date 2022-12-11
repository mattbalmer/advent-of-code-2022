export type Monkey = {
  number: number,
  items: number[],
  operation: (old: number) => number,
  test: (item: number) => boolean,
  targets: [onTrue: number, onFalse: number],
  inspections: number,
}