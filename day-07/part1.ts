import { Command, FileTree, parseCommand } from './shared';
import { Execute } from './format';

class DAGNode {
  name: string;
  parent: DAGNode | null;
  size: number;
  children: {};

  constructor(fields: Pick<DAGNode,
    'name' | 'parent' | 'size'
  >) {
    Object.assign(this, fields);
  }

  incrementSize = (size: number) => {
    this.size += size;
    this.parent?.incrementSize(size);
  }

  addChild = (node: Omit<DAGNode, 'parent'>) => {
    this.children[node.name] = new DAGNode({
      ...node,
      parent: this,
    });
  }
}

const tree: FileTree = {
  '/': {
    'a': {

    },
    'b.txt': 14848514,
    'c.dat': 8504156,
  }
};

const cd = (command: Command<'cd'>, tree: FileTree): FileTree => {
  return (tree[command.args[0]] || {}) as FileTree;
}

const ls = (command: Command<'ls'>, tree: FileTree): FileTree => {
  command.output.forEach((output) => {
    const [typeOrSize, name] = output.split(' ');
    if (typeOrSize === 'dir') {
      tree[name] = {};
    } else {
      tree[name] = parseInt(typeOrSize, 10);
    }
  });
  return tree;
}

const expandTree = (
  [current, ...commands]: [string, string[] | null][],
  tree: FileTree
): FileTree => {
  if (!current) {
    return tree;
  }
  const command = parseCommand(...current);
  const fn = {
    'cd': cd,
    'ls': ls,
  }[command.type];
  return {
    ...tree,
    // @ts-ignore
    ...expandTree(commands, fn(command, tree)),
  };
}

export const execute: Execute = (commands) => {
  console.log('commands', commands);
  const tree = expandTree(commands, {});
  console.log('tree', JSON.stringify(tree, null, 2));
  return 4;
}