export type Execute = (lines: [string, string][]) => number;

export const format = (raw: string): Parameters<Execute> => {
  return [
    raw.split('\n')
      .filter(line => Boolean(line))
      .map((line) => line.split(' ') as [string, string]),
  ];
}