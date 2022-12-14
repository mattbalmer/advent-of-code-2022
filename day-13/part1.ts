import { Execute, Packet } from './format';
import { sum } from '@utils/array';

const arePacketsOrdered = (a: Packet, b: Packet): boolean => {
  console.log('arePacketsOrdered', a, b);
  while(a.length > 0) {
    if (b.length < 1) {
      return false;
    }
    const left = a.shift();
    const right = b.shift();

    console.log('compare', left, right);

    if (typeof left === 'number' && typeof right === 'number') {
      if (left > right) {
        return false;
      }
    } else if (Array.isArray(left) && Array.isArray(right)) {
      while(left.length > 0) {
        if (right.length < 1) {
          return false;
        }

        const l1 = left.shift();
        const r1 = right.shift();

        console.log('l1r1', l1, r1);

        if (l1 < r1) {
          return true;
        }
        if (l1 > r1) {
          return false;
        }
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

      if (!isOrdered) {
        return false;
      }
    }
  }
  return true;
}

export const execute: Execute = (pairs) => {
  let indices = [];

  pairs.forEach(([a, b], i) => {
    const isCorrectOrder = arePacketsOrdered(a, b);
    console.log('are packets oredered?', i+1, isCorrectOrder);
    if (isCorrectOrder) {
      indices.push(i + 1);
    }
  });

  return sum(indices);
}