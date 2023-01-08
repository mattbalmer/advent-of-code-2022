export type ValveID = string;

export type Valve = {
  id: ValveID,
  rate: number,
  connections: ValveID[],
}