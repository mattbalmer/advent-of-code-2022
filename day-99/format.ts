export type Execute = (lines: number[]) => number;

export const format = (raw: string): Parameters<Execute> => {
  return [
    raw.split('\n')
      .map((line) => parseInt(line, 10)),
  ];
}