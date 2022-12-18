import { Axis, Coordinate3D, Execute, Face } from './format';

const faceToString = (face: Face): string => {
  return JSON.stringify(face);
}

const getFaces = ([x, y, z]: Coordinate3D): Face[] => {
  return Object.keys(Axis)
    .map((axis: Axis) => {
      const [a, b] = {
        x: [
          [x - 1, x],
          [x, x + 1],
        ],
        y: [
          [y - 1, y],
          [y, y + 1],
        ],
        z: [
          [z - 1, z],
          [z, z + 1],
        ],
      }[axis];
      return [
        {
          axis,
          x,
          y,
          z,
          [axis]: a,
        },
        {
          axis,
          x,
          y,
          z,
          [axis]: b,
        }
      ];
    })
    .flat();
}

export const execute: Execute = (coordinates) => {
  const faces = new Set<string>();

  coordinates.forEach((coordinate) => {
    const facesForCoord = getFaces(coordinate);

    facesForCoord.forEach((face) => {
      const faceString = faceToString(face);
      if (faces.has(faceString)) {
        faces.delete(faceString);
      } else {
        faces.add(faceString);
      }
    })
  });

  return faces.size;
}