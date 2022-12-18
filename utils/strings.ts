import { generate } from '@utils/array';

export const ALPHABET = generate<string>(26, (i) =>
  String.fromCharCode(97 + i)
);
