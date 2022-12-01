export type Execute = (lines: string[]) => number;

export const format = (raw: string): Parameters<Execute> => {
  return [
    raw.split('\n'),
  ];
}