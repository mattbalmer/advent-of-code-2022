// This is jank as hell
export type ArrayOfSize <N extends number, T> = N extends 2 ? [T, T] : N extends 3 ? [T, T, T] : N extends 4 ? [T, T, T, T] : T[];