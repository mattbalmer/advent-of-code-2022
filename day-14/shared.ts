import { Coordinate, coordToString } from '@utils/grid';

export type Formation = Coordinate[];
export type Bounds = {
  x: [number, number],
  y: [number, number],
};
export type CaveValue = 'rock' | 'source' | 'sand' | 'cliff';
export type CaveMap = Record<string, CaveValue>;
export type Cave = {
  formations: Formation[],
  map: CaveMap,
  source: Coordinate,
  bounds: Bounds,
};

export const isWithinBounds = (bounds: Bounds, coordinate: Coordinate, variance: number = 0): boolean => {
  const isXWithin = bounds.x[0] - variance <= coordinate[0] && coordinate[0] <= bounds.x[1] + variance;
  const isYWithin = bounds.y[0] - variance <= coordinate[1] && coordinate[1] <= bounds.y[1] + variance;
  return isXWithin && isYWithin;
}

export const getCaveValue = (cave: Cave, coordinate: Coordinate): CaveValue => {
  return cave.map[coordToString(coordinate)];
}

export const setCaveValue = (cave: Cave, coordinate: Coordinate, value: CaveValue): Cave => {
  cave.map[coordToString(coordinate)] = value;
  return cave;
}

export const exploreCave = (formations: Formation[], source: Coordinate, onRock?: (coordinate: Coordinate) => void): Bounds => {
  let [minX, minY] = [source[0], source[1]];
  let [maxX, maxY] = [source[0], source[1]];

  formations.forEach((formation) => {
    for(let i = 0; i < formation.length - 1; i++) {
      const start = formation[i];
      const end = formation[i + 1];

      const diffX = end[0] - start[0];
      const diffY = end[1] - start[1];

      const dist = Math.max(
        Math.abs(diffX),
        Math.abs(diffY)
      );

      const signX = Math.sign(diffX);
      const signY = Math.sign(diffY);

      for(let i = 0; i <= dist; i++) {
        const [x, y] = [
          start[0] + signX * i,
          start[1] + signY * i,
        ];

        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);

        onRock?.([x, y]);
      }
    }
  });

  return {
    x: [minX, maxX],
    y: [minY, maxY],
  }
}

export const mapCave = (formations: Formation[], source: Coordinate): Cave => {
  const map: CaveMap = {
    [coordToString(source)]: 'source',
  };

  const bounds = exploreCave(formations, source, ([x, y]) => {
    map[coordToString([x, y])] = 'rock';
  });

  return {
    map,
    source,
    formations,
    bounds,
  };
}