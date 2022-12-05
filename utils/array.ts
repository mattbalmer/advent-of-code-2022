type FillCallback<T> = (i: number) => T;

export const generate = <T = unknown>(size: number, fill: T | FillCallback<T>): T[] => {
  // @ts-ignore
  const getVal: FillCallback<T> = typeof fill === 'function' ? fill : () => fill;
  return Array.from({ length: size }, (_, i) => getVal(i));
}

export const sum = (array: number[]): number => {
  return array.reduce((total, value) => total + value, 0);
}

export const last = <T extends any = unknown>(array: T[]): T => {
  return array[array.length - 1];
}