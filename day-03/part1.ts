import { Execute } from './format';
import { split, sum } from '@utils/array';
import { getPriorityForLetter } from './shared';

const repeatsForLine = (line: string): string[] => {
  const [first, second] = split(line.split(''), line.length / 2);

  const letters = first.reduce((set, letter) =>
    set.add(letter),
    new Set<string>()
  );

  const repeated = second.reduce((set, letter) =>
    letters.has(letter) ? set.add(letter) : set,
    new Set<string>()
  );

  return Array.from(repeated);
}

export const execute: Execute = (lines) => {
  return sum(
    lines
      .map(repeatsForLine)
      .map(repeats => sum(
        repeats.map(getPriorityForLetter))
      )
  );
}