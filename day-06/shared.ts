export const containsRepeats = (chars: string[]): boolean => {
  return Array.from(new Set(chars)).length !== chars.length;
}

export const findIndexOfUniqueWindow = (string: string, count: number): number => {
  let i = count;
  let window = [...string.slice(0, i)];

  while (containsRepeats(window)) {
    const letter = string[i];

    window = [
      ...window.slice(1),
      letter
    ];

    i += 1;
  }

  return i;
}