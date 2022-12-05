export const getPriorityForLetter = (letter: string): number => {
  const charCode = letter.charCodeAt(0) - 64;

  // uppercase
  if (charCode <= 26) {
    return charCode + 26;
  }

  // shift lowercase into lower value
  return charCode - 32;
}