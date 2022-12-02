import { Execute } from './format';
import { getWinDrawLoss, LeftLetters, Outcome, OutcomePoints, Shape, ShapePoints } from './shared';
import { sum } from '@utils/array';

export const RightLetters: Record<string, Shape> = {
  'X': Shape.ROCK,
  'Y': Shape.PAPER,
  'Z': Shape.SCISSORS,
}

const getOutcomeForRound = (player: Shape, opponent: Shape): Outcome => {
  const [win, draw, loss] = getWinDrawLoss(opponent);

  const outcomeByShape = {
    [win]: Outcome.WIN,
    [draw]: Outcome.DRAW,
    [loss]: Outcome.LOSS,
  } as Record<Shape, Outcome>;

  return outcomeByShape[player];
}

const getPointsForRound = (opponent: Shape, response: Shape): number => {
  const outcome = getOutcomeForRound(response, opponent);
  const points = OutcomePoints[outcome] + ShapePoints[response];

  console.log('o,r,o,p', opponent, response, outcome, points);

  return points;
}

export const execute: Execute = (lines) => {
  return sum(lines
    .map(([left, right]) => {
      const opponent = LeftLetters[left];
      const response = RightLetters[right];
      return getPointsForRound(opponent, response);
    })
  )
}