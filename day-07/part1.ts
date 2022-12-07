import { Command, FileTree, parseCommand } from './shared';
import { Execute } from './format';

const tree = {
  '/': {
    type: 'dir,',
    children: {
      'a': {

      },
      'b.txt': 14848514,
      'c.dat': 8504156,
    },
    size: 0,
  }
};

const cd = (command: Command<'cd'>, output: string[], tree: FileTree): FileTree => {

}

const ls = (command: Command<'ls'>, output: string[], tree: FileTree): FileTree => {

}

const expandTree = (
  [current, ...commands]: [Command<'ls' | 'cd'>, string[]][],
  tree: FileTree
): FileTree => {
  if (!current) {
    return tree;
  }
  const command = parseCommand(current);
  const fn = {
    'cd': cd,
    'ls': ls,
  }[command.type];
  // @ts-ignore
  return expandTree(commands, fn(command, output, tree);
}

export const execute: Execute = (commands) => {
  console.log('commands', commands);
  const tree = expandTree(commands, {});
  return 4;
}