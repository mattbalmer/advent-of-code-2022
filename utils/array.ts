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

export const split = <T extends any = unknown>(array: T[], indices: number[] | number): T[][] => {
  const results = [];

  const indicesArray = Array.isArray(indices) ? indices : [indices];
  let lastIndex = 0;

  for(let ii = 0; ii <= indicesArray.length; ii++) {
    const index = ii < indicesArray.length ? indicesArray[ii] : array.length;

    const slice = array.slice(lastIndex, index);

    results.push(slice);

    lastIndex = index;
  }

  return results;
}

export const group = <T extends any = unknown>(array: T[], count: number): T[][] => {
  const results = [];

  array.forEach((entry, i) => {
    const newI = Math.floor(i / count);
    if(!results[newI]) {
      results[newI] = [];
    }
    results[newI].push(entry);
  });

  return results;
}