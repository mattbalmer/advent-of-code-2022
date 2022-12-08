import { Command, Execute } from './format';

const LIMIT = 100_000;

type DAGNodeArgs = Pick<Node,
  'name' | 'parent' | 'size'
>;
class Node {
  name: string;
  parent: Node | null;
  size: number;
  children: Record<string, Node> = {};

  constructor(fields: DAGNodeArgs) {
    Object.assign(this, {
      ...fields,
      size: 0,
    });
    this.incrementSize(fields.size);
  }

  incrementSize = (size: number) => {
    this.size += size;
    this.parent?.incrementSize(size);
  }

  addChild = (node: Omit<DAGNodeArgs, 'parent'>) => {
    this.children[node.name] = new Node({
      ...node,
      parent: this,
    });
  }

  root = () => {
    return this.parent?.root() || this;
  }

  get isDir() {
    return Object.keys(this.children).length > 0;
  }

  flatten = () => {
    return [
      this,
      ...Object.values(this.children).map(child => child.flatten()).flat(),
    ]
  }

  toJSON() {
    return {
      name: this.name,
      size: this.size,
      parent: this.parent?.name,
      children: this.children,
    }
  }
}

const cd = (command: Command, node: Node): Node => {
  const [, path] = command.input;
  return path === '/'
    ? node.root()
    : path === '..'
      ? node.parent
      : node.children[path];
}

const ls = (command: Command, node: Node): Node => {
  command.output.forEach((output) => {
    const [typeOrSize, name] = output.split(' ');
    if (typeOrSize === 'dir') {
      node.addChild({
        name,
        size: 0
      });
    } else {
      node.addChild({
        name,
        size: parseInt(typeOrSize, 10),
      });
    }
  });
  return node;
}

const expandTree = (
  [command, ...commands]: Command[],
  node: Node
): Node => {
  if (!command) {
    return node;
  }

  const [type] = command.input;
  const fn = {
    cd,
    ls,
  }[type];

  return expandTree(
    commands,
    fn(command, node)
  );
}

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