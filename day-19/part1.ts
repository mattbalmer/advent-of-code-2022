import { Execute } from './format';

export const execute: Execute = (blueprints) => {
  console.log('blueprints', JSON.stringify(blueprints, null, 2));
  return 4;
}