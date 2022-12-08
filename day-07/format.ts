export type Execute = (commands: [
  command: string,
  output: string[]
][]) => number;
export const format = (raw: string): Parameters<Execute> => {
  const lines = raw.split('\n');

  const commands = lines.reduce((commands, line) => {
    if (!line) {
      return commands;
    }
    const isCommand = line.startsWith('$');
    if (isCommand) {
      return [
        ...commands,
        [line, null],
      ];
    }
    if (!commands[commands.length - 1][1]) {
      commands[commands.length - 1][1] = [];
    }
    commands[commands.length - 1][1].push(line);
    return commands;
  }, []);

  return [
    commands,
  ];
}