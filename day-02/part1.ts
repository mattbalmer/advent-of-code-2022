import { Execute } from './format';
import { LeftLetters, Outcome, OutcomePoints, RightLetters, Shape, ShapePoints } from './shared';
import { sum } from '@utils/array';

const ShapeOrder: Shape[] = [
  Shape.ROCK,
  Shape.PAPER,
  Shape.SCISSORS,
];

const getResponses = (shape: Shape) => {
  const i = ShapeOrder.indexOf(shape);
  const shapeCount = ShapeOrder.length;

  const win = ShapeOrder[(i + 1) % shapeCount];
  const draw = ShapeOrder[i];
  const loss = ShapeOrder[(shapeCount + i - 1) % shapeCount];

  return {
    [win]: Outcome.WIN,
    [draw]: Outcome.DRAW,
    [loss]: Outcome.LOSS,
  } as Record<Partial<Shape>, Outcome>
}

const getOutcomeForRound = (player: Shape, opponent: Shape): Outcome => {
  return getResponses(opponent)[player];
}

const getPointsForRound = (player: Shape, opponent: Shape): number => {
  const outcome = getResponses(opponent)[player];

  return OutcomePoints[outcome] + ShapePoints[player]
}

export const execute: Execute = (lines) => {
  const rounds = lines
    .map(([left, right]) => {
      const opponent = LeftLetters[left];
      const response = RightLetters[right];
      const points = getPointsForRound(response, opponent);
      console.log('o,r,o,p', opponent, response, getOutcomeForRound(response, opponent), points);
      return {
        opponent,
        response,
        points,
      }
    });
  return sum(rounds.map((round) => round.points));
}