import { Execute } from './format';

const TRIGGER_LEN = 14;

const containsRepeats = (chars: string[]): boolean => {
  return Array.from(new Set(chars)).length !== chars.length;
}

export const execute: Execute = (line) => {
  let window = [...line.slice(0, TRIGGER_LEN)];

  if (!containsRepeats(window)) {
    return TRIGGER_LEN + 1;
  }

  for(let i = TRIGGER_LEN; i < line.length; i++) {
    const letter = line[i];

    window = [
      ...window.slice(1),
      letter
    ];

    if (!containsRepeats(window)) {
      return i + 1;
    }
  }

  return -1;
}