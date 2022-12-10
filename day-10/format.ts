export type Execute = (lines: string[]) => number | string;

export const format = (raw: string): Parameters<Execute> => {
  return [
    raw
      .split('\n')
      .filter(line => Boolean(line)),
  ];
}