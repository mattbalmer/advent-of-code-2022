export type FileTree = {
  [k: string]: FileTree | number,
};

export type CommandType = 'cd' | 'ls';

export type Command<T extends CommandType> = {
  type: T,
  args: {
    'cd': [path: string],
    'ls': [],
  }[T],
  output: string[]
};

export type Parser<T extends CommandType> = (...args: string[]) => Command<T>['args'];

export const toCommand = <T extends CommandType>(type: T, command: Omit<Command<T>, 'type'>): Command<T> => {
  return {
    ...command,
    type,
  } as Command<T>
}

export const parseArgs = <T extends CommandType>(type: T, args: string[]): Command<T>['args'] => {
  return ({
    'cd': (dir) => [dir],
    'ls': () => [],
  } as {
    [C in CommandType]: Parser<C>
  })[type](...args);
}

export const parseCommand = (raw: string): Command<CommandType> => {
  const [, type, ...args] = raw.split(' ');
  return toCommand(type as CommandType, {
    args: parseArgs(type as CommandType, args),
  });
}