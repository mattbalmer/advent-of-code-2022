type DebugLevel = 'all' | 'test' | 'execute';

let DEBUG_ENABLED = false;
let DEBUG_LEVEL: DebugLevel = undefined;

export const toPrint: [string, string][] = [];

export const printWithAnswer = (label: string, value: string) => {
  toPrint.push([label, value]);
}

export const enableDebug = (level: DebugLevel = 'test') => {
  DEBUG_ENABLED = true;
  DEBUG_LEVEL = level;
}
export const disableDebug = () => DEBUG_ENABLED = false;


export function log(level: DebugLevel, fn: () => any);
export function log(fn: () => any);
export function log(...args) {
  const level: DebugLevel = args[1] ? args[0] : 'test';
  const fn: () => any = args[1] ? args[1] : args[0];

  if (DEBUG_ENABLED && (DEBUG_LEVEL === level || level === 'all')) {
    const output = fn();
    const args = Array.isArray(output) ? output : [output]
    console.log(...args);
  }
}
