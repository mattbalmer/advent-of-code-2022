import { Execute, Packet } from './format';
import { mult } from '@utils/array';

const DIVIDER_PACKETS = [
  [[2]],
  [[6]]
];

const comparePackets = (a: Packet, b: Packet): number => {
  for(let i = 0; i < a.length; i++) {
    if (b.length <= i) {
      return 1;
    }
    const left = a[i];
    const right = b[i];

    if (typeof left === 'number' && typeof right === 'number') {
      if (left > right) {
        return 1;
      }
      if (left < right) {
        return -1;
      }
    } else {
      const value = comparePackets(
        Array.isArray(left) ?
          left
          : [left],
        Array.isArray(right) ?
          right
          : [right]
      );

      if (value !== 0) {
        return value;
      }
    }
  }

  if (b.length === a.length) {
    return 0;
  }

  return -1;
}

const findPacketIndex = (packets: Packet[], packet: Packet): number => {
  return packets.findIndex((p) => comparePackets(packet, p) === 0);
}

export const execute: Execute = (pairs) => {
  const packets: Packet[] = [
    ...pairs.flat(1),
    ...DIVIDER_PACKETS,
  ];

  packets
    .sort((a, b) =>
      comparePackets(a, b)
    );

  return mult(
    DIVIDER_PACKETS.map((packet) =>
      findPacketIndex(packets, packet) + 1
    )
  )
}