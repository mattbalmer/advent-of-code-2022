import { Execute, Packet } from './format';
import { sum } from '@utils/array';

const arePacketsOrdered = (a: Packet, b: Packet): boolean => {
  while(a.length > 0) {
    if (b.length < 1) {
      return false;
    }
    const left = a.shift();
    const right = b.shift();

    if (typeof left === 'number' && typeof right === 'number') {
      if (left > right) {
        return false;
      }
      if (left < right) {
        return true;
      }
    } else {
      const isOrdered = arePacketsOrdered(
        Array.isArray(left) ?
          left
          : [left],
        Array.isArray(right) ?
          right
          : [right]
      );

      if (isOrdered !== undefined) {
        return isOrdered;
      }
    }
  }

  if (b.length === 0) {
    return undefined;
  }

  return true;
}

export const execute: Execute = (pairs) => {
  let indices = [];

  pairs.forEach(([a, b], i) => {
    const isCorrectOrder = arePacketsOrdered(a, b);
    if (isCorrectOrder) {
      indices.push(i + 1);
    }
  });

  return sum(indices);
}