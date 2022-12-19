import { subtract, sum } from '@utils/array';

export type Resource = 'ore' | 'clay' | 'obsidian' | 'geode';

export type GResourceRecord <T> = Partial<Record<Resource, T>>;
export type ResourceRecord = GResourceRecord<number>;

export type Blueprint = {
  id: number,
  robots: Record<Resource, ResourceRecord>,
}

export const keysIn = (objects: object[]): string[] =>
  objects.map(o => Object.keys(o)).flat();

export const addResourceRecords = (...records: ResourceRecord[]): ResourceRecord => {
  return keysIn(records).reduce((map, key) => {
    return {
      ...map,
      [key]: sum(
        records.map((record) => (record[key] || 0)),
      )
    }
  }, {});
}
export const subtractResourceRecords = (...records: ResourceRecord[]): ResourceRecord => {
  return keysIn(records).reduce((map, key) => {
    return {
      ...map,
      [key]: subtract(
        records.map((record) => (record[key] || 0)),
      )
    }
  }, {});
}