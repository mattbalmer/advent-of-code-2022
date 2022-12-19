export type Resource = 'ore' | 'clay' | 'obsidian' | 'geode';

export type Cost = Partial<Record<Resource, number>>;

export type Blueprint = {
  id: number,
  robots: Record<Resource, Cost>,
}