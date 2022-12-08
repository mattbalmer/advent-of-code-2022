import { Command } from './format';

export type DAGNodeArgs = Pick<Node,
  'name' | 'parent' | 'size'
>;
export class Node {
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
      ...Object
        .values(this.children)
        .map(child => child.flatten())
        .flat(),
    ] as Node[]
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


export const cd = (command: Command, node: Node): Node => {
  const [, path] = command.input;
  return path === '/'
    ? node.root()
    : path === '..'
      ? node.parent
      : node.children[path];
}

export const ls = (command: Command, node: Node): Node => {
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

export const expandTree = (
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
