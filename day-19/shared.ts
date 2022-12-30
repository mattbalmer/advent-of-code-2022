import { subtract, sum } from '@utils/array';

export type Resource = 'ore' | 'clay' | 'obsidian' | 'geode';

export type ResourceRecord = Record<Resource, number>;

export type Blueprint = {
  id: number,
  robots: Record<Resource, ResourceRecord>,
}

export const emptyResourceRecord = (): ResourceRecord => ({
  ore: 0,
  clay: 0,
  obsidian: 0,
  geode: 0,
});

export const keysIn = (objects: ResourceRecord[]): Resource[] =>
  objects.map(o => Object.keys(o)).flat() as Resource[];

export const addResourceRecords = (...records: ResourceRecord[]): ResourceRecord => {
  return keysIn(records).reduce((map, resource) => {
    return {
      ...map,
      [resource]: sum(
        records.map((record) => record[resource]),
      )
    }
  }, emptyResourceRecord());
}
export const subtractResourceRecords = (...records: ResourceRecord[]): ResourceRecord => {
  return keysIn(records).reduce((map, resource) => {
    return {
      ...map,
      [resource]: subtract(
        records.map((record) => record[resource]),
      )
    }
  }, emptyResourceRecord());
}