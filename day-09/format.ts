import { DIR } from '@utils/grid';

export type Movement = {
  direction: DIR,
  distance: number,
};
export type Execute = (movements: Movement[]) => number;

const LETTER_TO_DIR = {
  'U': DIR.UP,
  'R': DIR.RIGHT,
  'D': DIR.DOWN,
  'L': DIR.LEFT,
}

export const format = (raw: string): Parameters<Execute> => {
  return [
    raw.split('\n')
      .filter(line => Boolean(line))
      .map((line) => {
        const [letter, distance] = line.split(' ');
        return {
          direction: LETTER_TO_DIR[letter],
          distance: parseInt(distance, 10),
        }
      }),
  ];
}