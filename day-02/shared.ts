export enum Shape {
  ROCK = 'ROCK',
  PAPER = 'PAPER',
  SCISSORS = 'SCISSORS',
}

export enum Outcome {
  WIN = 'WIN',
  DRAW = 'DRAW',
  LOSS = 'LOSS',
}

export const ShapePoints: Record<Shape, number> = {
  [Shape.ROCK]: 1,
  [Shape.PAPER]: 2,
  [Shape.SCISSORS]: 3,
}

export const OutcomePoints: Record<Outcome, number> = {
  [Outcome.WIN]: 6,
  [Outcome.DRAW]: 3,
  [Outcome.LOSS]: 0,
}

export const LeftLetters: Record<string, Shape> = {
  'A': Shape.ROCK,
  'B': Shape.PAPER,
  'C': Shape.SCISSORS,
}

export const RightLetters: Record<string, Shape> = {
  'X': Shape.ROCK,
  'Y': Shape.PAPER,
  'Z': Shape.SCISSORS,
}
