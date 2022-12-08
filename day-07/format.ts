export type Command = {
  input: [command: 'ls' | 'cd', ...args: string[]],
  output: string[] | null
};
export type Execute = (commands: Command[]) => number;
export const format = (raw: string): Parameters<Execute> => {
  const lines = raw.split('\n');

  const commands = lines.reduce((commands, input) => {
    if (!input) {
      return commands;
    }
    const isCommand = input.startsWith('$');
    if (isCommand) {
      return [
        ...commands,
        {
          input: input.split(' ').slice(1),
          output: null,
        },
      ];
    }
    if (!commands[commands.length - 1].output) {
      commands[commands.length - 1].output = [];
    }
    commands[commands.length - 1].output.push(input);
    return commands;
  }, []);

  return [
    commands,
  ];
}