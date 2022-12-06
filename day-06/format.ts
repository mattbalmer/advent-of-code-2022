export type Execute = (line: string) => number;

export const format = (raw: string): Parameters<Execute> => {
  return [
    raw
  ];
}