import { main } from './part1';

export const format = (raw: string): Parameters<typeof main> => {
  return [
    raw.split('\n'),
  ];
}