import { Axis, Coordinate3D } from './format';

export type Bounds = {
  x: [number, number],
  y: [number, number],
  z: [number, number],
}

export const shift = ([x, y, z]: Coordinate3D, axis: Axis, distance: number): Coordinate3D => {
  const mods = {
    x: [distance, 0, 0],
    y: [0, distance, 0],
    z: [0, 0, distance],
  }[axis];
  return [
    x + mods[0],
    y + mods[1],
    z + mods[2],
  ]
}

export const getAdjacentCoordinates = (coordinate: Coordinate3D): Coordinate3D[] => {
  return Object.keys(Axis)
    .map((axis: Axis) => {
      return [-1, 1].map((distance) => {
        return shift(coordinate, axis, distance);
      })
    })
    .flat();
}

export const distanceToEdge = ([x, y, z]: Coordinate3D, bounds: Bounds): number => {
  return Math.min(...[
    x - bounds.x[0],
    bounds.x[1] - x,
    y - bounds.y[0],
    bounds.y[1] - y,
    z - bounds.z[0],
    bounds.z[1] - z,
  ])
}

export type StackEntry = {
  path: Coordinate3D[],
  distance: number,
}
