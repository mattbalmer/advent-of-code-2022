import { Execute } from './format';
import { group, sum } from '@utils/array';
import { getPriorityForLetter } from './shared';

const repeatsForGroup = (group: string[]): string[] => {
  const [first, ...rest] = group;

  const letters = first.split('').reduce((set, letter) =>
      set.add(letter),
    new Set<string>()
  );

  for(const line of rest) {
    letters.forEach(letter => {
      if (!line.includes(letter)) {
        letters.delete(letter);
      }
    });
  }

  return Array.from(letters);
}

export const execute: Execute = (lines) => {
  return sum(
    group(lines, 3)
      .map(repeatsForGroup)
      .map(repeats => sum(
        repeats.map(getPriorityForLetter))
      )
  );
}