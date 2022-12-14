import { Execute } from './format';
import { Coordinate, DIR, traverse } from '@utils/grid';
import { Cave, getCaveValue, isWithinBounds, mapCave, setCaveValue } from './shared';
import { caveToString } from './debug';

const SOURCE: Coordinate = [500, 0];

const findRestingPoint = (cave: Cave, sand: Coordinate = cave.source): null | Coordinate => {
  if (!isWithinBounds(cave.bounds, sand)) {
    return null;
  }

  const available = [
    [DIR.DOWN],
    [DIR.DOWN, DIR.LEFT],
    [DIR.DOWN, DIR.RIGHT],
  ];

  const nextCoordinate = available
    .map((dirs) =>
      dirs.reduce((coord, dir) =>
          traverse(coord, dir),
        sand
      )
    )
    .find((coordinate) =>
      // If no value - this is a valid coordinate to move to
      !getCaveValue(cave, coordinate)
    );

  if (nextCoordinate) {
    return findRestingPoint(cave, nextCoordinate);
  }

  return sand;
}

export const execute: Execute = (paths) => {
  const cave = mapCave(paths, SOURCE);
  let hasSandEscapedCave = false;
  let sandCount = 0;

  console.log(
    caveToString(cave)
  );

  // todo: calculate ending point of sand, return when coord of sand exceed bounds of cave, then mark (hmm, somehow most recent sand/rock-adjacent empty space) as edge

  while (!hasSandEscapedCave) {
    const restingPoint = findRestingPoint(cave);

    if (restingPoint) {
      setCaveValue(cave, restingPoint, 'sand');
      sandCount += 1;
      console.clear();
      console.log(
        caveToString(cave)
      );
    } else {
      hasSandEscapedCave = true;
      break;
    }
  }

  return sandCount;
}