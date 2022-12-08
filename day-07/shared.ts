export type FileTree = {
  [k: string]: FileTree | number,
};

export type LSOutput = {
  type: 'dir',
  name: string,
} | {
  type: 'file',
  size: number,
};
export type CommandType = 'cd' | 'ls';
export type Command<T extends CommandType | unknown = unknown> = {
  type: CommandType,
  args: T extends CommandType ? {
    'cd': [path: string],
    'ls': [],
  }[T] : string[],
  output: string[]
};

export const parseCommand = (input: string, output: string[] | null): Command => {
  const [, type, ...args] = input.split(' ');
  return {
    type: type as CommandType,
    args,
    output,
  }
}