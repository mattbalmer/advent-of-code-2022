type FillCallback<T> = (i: number) => T;

export const generate = <T = unknown>(size: number, fill: T | FillCallback<T>): T[] => {
  // @ts-ignore
  const getVal: FillCallback<T> = typeof fill === 'function' ? fill : () => fill;
  return Array.from({ length: size }, (_, i) => getVal(i));
}