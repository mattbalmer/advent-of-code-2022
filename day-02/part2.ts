import { Execute } from './format';
import { LeftLetters, Outcome, OutcomePoints, Shape, ShapePoints } from './shared';
import { sum } from '@utils/array';

export const RightLetters: Record<string, Outcome> = {
  'X': Outcome.LOSS,
  'Y': Outcome.DRAW,
  'Z': Outcome.WIN,
}

const ShapeOrder: Shape[] = [
  Shape.ROCK,
  Shape.PAPER,
  Shape.SCISSORS,
];

const getResponses = (shape: Shape): Record<Outcome, Shape> => {
  const i = ShapeOrder.indexOf(shape);
  const shapeCount = ShapeOrder.length;

  return {
    [Outcome.WIN]: ShapeOrder[(i + 1) % shapeCount],
    [Outcome.DRAW]: ShapeOrder[i],
    [Outcome.LOSS]: ShapeOrder[(shapeCount + i - 1) % shapeCount],
  }
}

const getResponseForRound = (opponent: Shape, outcome: Outcome): Shape => {
  return getResponses(opponent)[outcome];
}

const getPointsForRound = (opponent: Shape, outcome: Outcome): number => {
  const response = getResponses(opponent)[outcome];
  return OutcomePoints[outcome] + ShapePoints[response];
}

export const execute: Execute = (lines) => {
  const rounds = lines
    .map(([left, right]) => {
      const opponent = LeftLetters[left];
      const outcome = RightLetters[right];
      const response = getResponseForRound(opponent, outcome);
      const points = getPointsForRound(opponent, outcome);
      console.log('o,r,o,p', opponent, outcome, response, response, points);
      return {
        opponent,
        response,
        points,
      }
    });
  return sum(rounds.map((round) => round.points));
}