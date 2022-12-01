export type Execute = (calories: number[][]) => number;

export const format = (raw: string): Parameters<Execute> => {
  const lines = raw.split('\n');
  return [
    lines.reduce((elves, line) => {
      if (!line) {
        return [
          [],
          ...elves
        ];
      }

      const value = parseInt(line, 10);

      elves[0].push(value);

      return elves;
    }, [
      []
    ]),
  ];
}