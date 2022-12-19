import { toInt } from '@utils/numbers';
import { Blueprint, Cost } from './shared';

const robotregex = () =>
  /Each ([a-z]+) robot costs (.+)\.?/gm

const costregex = () =>
  /(\d+) ([a-z]+)/gm

const parseCost = (chunk: string): Cost => {
  return chunk.split(' and ').reduce((map, resourceCostText) => {
    const [, amount, resource] =  (costregex().exec(resourceCostText) || []);
    return {
      ...map,
      [resource]: toInt(amount),
    }
  }, {} as Cost);
}

const parseBlueprint = (chunk: string): Blueprint => {
  const [id_, robotsChunk] = chunk.split(':');
  const id = toInt(id_);

  const robotsText = robotsChunk.split('. ');
  const robots: Blueprint['robots'] = robotsText.reduce((map, robotDescription) => {
    const [, type, costText] = robotregex().exec(robotDescription) || [];

    return {
      ...map,
      [type]: parseCost(costText),
    }
  }, {} as Blueprint['robots']);

  return {
    id,
    robots,
  }
}

export type Execute = (blueprints: Blueprint[]) => number;
export const format = (raw: string): Parameters<Execute> => {
  const chunks = raw.split('Blueprint')
    .map(chunk =>
      chunk.replaceAll('\n', '').trim()
    )
    .filter(_ => Boolean(_));

  return [
    chunks.map(parseBlueprint)
  ];
}