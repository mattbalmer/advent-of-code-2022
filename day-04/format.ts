export type Sections = [number, number];
export type Group = [Sections, Sections];

export type Execute = (pairs: Group[]) => number;
export const format = (raw: string): Parameters<Execute> => {
  return [
    raw.split('\n')
      .filter(line => Boolean(line))
      .map(line =>
        line.split(',')
          .map(sections =>
            sections.split('-')
              .map(section =>
                parseInt(section, 10)
              ) as Sections
          ) as Group
      ),
  ];
}