let DEBUG_ENABLED = false;

export const toPrint: [string, string][] = [];

export const printWithAnswer = (label: string, value: string) => {
  toPrint.push([label, value]);
}

export const enableDebug = () => DEBUG_ENABLED = true;
export const disableDebug = () => DEBUG_ENABLED = false;

export const log = (log: () => Parameters<typeof console.log>): void => {
  if (DEBUG_ENABLED) {
    console.log(...log());
  }
}