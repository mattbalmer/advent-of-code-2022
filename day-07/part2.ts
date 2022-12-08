import { Execute } from './format';
import { expandTree, Node } from './shared';

const TOTAL_SPACE = 70000000;
const MIN_FREE_SPACE = 30000000;

export const execute: Execute = (commands) => {
  const tree = expandTree(commands, new Node({
    parent: null,
    name: '/',
    size: 0,
  })).root();

  const freeSpace = TOTAL_SPACE - tree.size;
  const minDirSize = MIN_FREE_SPACE - freeSpace;

  const validDirs = tree
    .flatten()
    .filter((node) => node.isDir && node.size >= minDirSize)
    .sort((a, b) => a.size - b.size);

  return validDirs[0].size;
}