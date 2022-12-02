import { Execute } from './format';
import { getWinDrawLoss, LeftLetters, Outcome, OutcomePoints, Shape, ShapePoints } from './shared';
import { sum } from '@utils/array';

export const RightLetters: Record<string, Outcome> = {
  'X': Outcome.LOSS,
  'Y': Outcome.DRAW,
  'Z': Outcome.WIN,
}

const getResponseForRound = (opponent: Shape, outcome: Outcome): Shape => {
  const [win, draw, loss] = getWinDrawLoss(opponent);

  const shapeByOutcome = {
    [Outcome.WIN]: win,
    [Outcome.DRAW]: draw,
    [Outcome.LOSS]: loss,
  };

  return shapeByOutcome[outcome];
}

const getPointsForRound = (opponent: Shape, outcome: Outcome): number => {
  const response = getResponseForRound(opponent, outcome);
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