import { Execute } from './format';
import { addResourceRecords, Blueprint, Resource, ResourceRecord, subtractResourceRecords } from './shared';
import { generate, sum } from '@utils/array';
import { toInt } from '@utils/numbers';

const json = (val) => JSON.stringify(val, null, 2);

const TIME = 24;

type GameState = {
  resources: ResourceRecord,
  bots: ResourceRecord,
}

const canAfford = (blueprint: Blueprint, resources: ResourceRecord, type: Resource): boolean => {
  const cost = blueprint.robots[type];
  return Object.entries(cost)
    .every(([resource, amount]) =>
      resources[resource] >= amount
    );
}

const order = (blueprint: Blueprint, state: GameState): ResourceRecord => {
  const HIERARCHY: Resource[] = [
    'geode',
    'obsidian',
    'clay',
    // 'ore'
  ];

  for(const type of HIERARCHY) {
    if (canAfford(blueprint, state.resources, type)) {
      return {
        [type]: 1,
      }
    }
  }

  return {};
}

const build = (blueprint: Blueprint, state: GameState, orders: ResourceRecord): GameState => {
  const costsList = Object.entries(orders).map(([type, amount]): ResourceRecord[] =>
    generate(amount, () => blueprint.robots[type])
  ).flat();

  const totalCost = addResourceRecords(...costsList);

  console.log(`Building`, json(orders));
  console.group();
  console.log(`for `, json(totalCost));
  console.groupEnd();

  return {
    bots: addResourceRecords(state.bots, orders),
    resources: subtractResourceRecords(state.resources, totalCost),
  }
}

const executeBlueprint = (blueprint: Blueprint): GameState => {
  let state: GameState = {
    resources: {},
    bots: {
      ore: 1,
    },
  };

  for(let minute = 0; minute < TIME; minute++) {
    console.log(`Minute ${minute + 1}`, json(state));

    console.group();

    // Order
    const orders: ResourceRecord = order(blueprint, state);
    console.log(`Orders:`, json(orders));

    // Collect
    state.resources = addResourceRecords(state.resources, state.bots);
    console.log(`Collect:`, json(state.bots));

    // Build
    state = build(blueprint, state, orders);

    console.groupEnd();

    console.log('\n ----- \n');
  }

  return state;
}

export const execute: Execute = (blueprints) => {
  // start w/ naive 'build bots as soon as possible' approach - I know this won't work for all blueprints, but need to start somewhere

  const endStates = blueprints.reduce(
    (results, blueprint) => ({
      ...results,
      [blueprint.id]: executeBlueprint(blueprint),
    }),
    {} as Record<number, GameState>
  );

  console.log('endStates',
    JSON.stringify(endStates, null, 2)
  );

  const qualityLevels = Object.entries(endStates).map(([
    blueprintID,
    endState
  ]) =>
    toInt(blueprintID) * endState.resources.geode
  );

  console.log('qualityLevels', qualityLevels);

  return sum(qualityLevels);
}