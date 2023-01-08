import { Valve } from './shared';
import { toInt } from '@utils/numbers';
import { linesInFile } from '@utils/data';

const valveregex = () =>
  /Valve ([A-Z]+) has flow rate=(\d+); tunnels? leads? to valves? ([A-Z,\s]+)$/gm

const parseValve = (line: string): Valve => {
  const [, id, flowRate, connections] = valveregex().exec(line) || [];
  console.log('raw', line, ' > ', id, flowRate, connections);
  return {
    id,
    rate: toInt(flowRate),
    connections: connections.split(', '),
  }
}

export type Execute = (valves: Valve[]) => number;
export const format = (raw: string): Parameters<Execute> => {
  return [
    linesInFile(raw)
      .map(line =>
        parseValve(line)
      ),
  ];
}