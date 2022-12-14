import { Execute } from './format';
import { Coordinate, DIR, traverse } from '@utils/grid';
import { Cave, getCaveValue, isWithinBounds, mapCave, setCaveValue } from './shared';
import { caveToString } from './debug';

const SOURCE: Coordinate = [500, 0];

const FALL_DIRS = [
  [DIR.DOWN],
  [DIR.DOWN, DIR.LEFT],
  [DIR.DOWN, DIR.RIGHT],
];

const findRestingPoint = (cave: Cave, sand: Coordinate = cave.source): null | Coordinate => {
  if (sand[1] >= cave.bounds.y[1]) {
    return null;
  }

  const nextCoordinate = FALL_DIRS
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