export type Packet = (number | Packet)[];
export type Execute = (lines: [Packet, Packet][]) => number;
export const format = (raw: string): Parameters<Execute> => {
  return [
    raw.split('\n\n').map((lines =>
      lines.split('\n')
        .filter(_ => Boolean(_))
        .map(_ => JSON.parse(_)) as [Packet, Packet]
    )),
  ];
}