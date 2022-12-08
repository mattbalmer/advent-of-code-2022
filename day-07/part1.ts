import { Execute } from './format';
import { expandTree, Node } from './shared';

const LIMIT = 100_000;

export const execute: Execute = (commands) => {
  const tree = expandTree(commands, new Node({
    parent: null,
    name: '/',
    size: 0,
  })).root();

  return tree
    .flatten()
    .filter((node) => node.isDir && node.size <= LIMIT)
    .reduce((size, node) => size + node.size, 0);
}