import { generate } from '@utils/array';

export const ALPHABET = generate<string>(26, (i) =>
  String.fromCharCode(97 + i)
);

export const linesInFile = (string: string): string[] => {
  const lines = string.split('\n');
  const isLastLineEmpty = Boolean(lines[lines.length - 1]);

  if (isLastLineEmpty) {
    return lines.slice(0, -1);
  }

  return lines.slice(0);
}