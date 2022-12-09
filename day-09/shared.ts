import { DIR } from '@utils/grid';

export const DirectionFlippedVert: Record<DIR, DIR> = {
  DOWN: DIR.UP,
  UP: DIR.DOWN,
  LEFT: DIR.LEFT,
  RIGHT: DIR.RIGHT,
};

export const printVisited = (size: number, visited: Set<string>) => {
  const lines = [];
  for(let y = 0; y < size; y++) {
    let line = '';
    for(let x = 0; x < size; x++) {
      const wasVisited = visited.has(`${x},${y}`);
      line += wasVisited ? '#' : '.';
    }
    lines.push(line);
  }
  console.log(
    lines.reverse().join('\n')
  );
}
