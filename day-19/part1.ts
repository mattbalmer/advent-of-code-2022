import { Execute } from './format';
import { addResourceRecords, Blueprint, Resource, ResourceRecord, subtractResourceRecords } from './shared';
import { binaryInsert, sum } from '@utils/array';
import { toInt } from '@utils/numbers';
import { triangle } from '@utils/math';

const json = (val) => JSON.stringify(val, null, 2);

const TIME = 24;

const HIERARCHY: Resource[] = [
  'geode',
  'obsidian',
  'clay',
  'ore'
];

type GameState = {
  resources: ResourceRecord,
  bots: ResourceRecord,
  time: number,
}

const stateKey = (state: GameState) => JSON.stringify(state);

const getGuaranteedScore = (state: GameState): number => {
  const currentGeodes = state.resources.geode || 0;
  // const guaranteedGeodes = state.time * (state.bots.geode || 0);
  // return currentGeodes + guaranteedGeodes;
  return currentGeodes;
}

const getHypotheticalScore = (state: GameState): number => {
  return getGuaranteedScore(state) + triangle(state.time);
}

const getEvalScore = (state: GameState): number => {
  const obsidianBotScore = (state.bots.obsidian || 0) / 10;
  const clayBotScore = (state.bots.clay || 0) / 100;
  const oreBotScore = (state.bots.ore || 0) / 1000;
  const score = getHypotheticalScore(state) + obsidianBotScore + clayBotScore + oreBotScore;
  return -1 * score;
}

const getOrderCost = (blueprint: Blueprint, order: ResourceRecord): ResourceRecord => {
  const costs = Object.entries(order)
    .map(([bot]) => // generate for quantity + flat, if ever more than 1
      blueprint.robots[bot]
    );

  return addResourceRecords(...costs);
}

const canAfford = (blueprint: Blueprint, resources: ResourceRecord, type: Resource): boolean => {
  const cost = blueprint.robots[type];
  // console.log('\ncost for', type, cost, '\n')
  return Object.entries(cost)
    .every(([resource, amount]) =>
      resources[resource] >= amount
    );
}

const getPossibleOrders = (blueprint: Blueprint, state: GameState): ResourceRecord[] => {
  // console.log(`\npossible orders for:`, json(state), '\n');
  const maxOf = (resource: Resource): number =>
    Math.max(
      ...Object.values(blueprint.robots)
        .map((cost) => cost[resource] || 0)
    );

  // HIERARCHY.forEach(resource => {
  //   console.log('max', resource, maxOf(resource));
  // })

  return HIERARCHY
    .filter((resource) =>
      canAfford(blueprint, state.resources, resource) && (
        resource === 'geode' || (state.bots[resource] || 0 < maxOf(resource))
      )
    )
    .map((resource) => ({
      [resource]: 1,
    }));
}

const executeBlueprint = (blueprint: Blueprint): GameState => {
  console.log('eval blueprint', json(blueprint));``
  const initialState = {
    resources: {},
    bots: {
      ore: 1,
    },
    time: TIME,
  };

  let best: {
    score: number,
    state: GameState,
  } = {
    state: initialState,
    score: getGuaranteedScore(initialState),
  };

  const seen = new Map<string, number>();

  let states: [number, number, GameState][] = [
    [getEvalScore(initialState), getGuaranteedScore(initialState), initialState]
  ];

  let evalCount = 0;

  while (states.length > 0) {
    // evalCount += 1;
    // if (evalCount > 5) {
    //   break;
    // }
    const [evs, guaranteed, state] = states.shift();
    // console.log('\nEvaluating', state.time, evs, guaranteed, best.score, json(state));
    console.group();

    if (state.time < 1 || (guaranteed < best.score && state.time <= best.state.time) || getHypotheticalScore(state) <= best.score) {
      console.log('prune');
      console.groupEnd();
      continue;
    }

    // Try all possible orders - including no order
    const orders = [
      {},
      ...getPossibleOrders(blueprint, state)
    ];

    // console.log('orders', json(orders));

    // Regardless - collect same resources
    // state.resources = addResourceRecords(state.resources, state.bots);

    // New bot state for each order, add to stack
    orders.forEach((order) => {
      console.group();

      if (order.geode > 0 && (state.bots.geode || 0) < 1) {
        console.log(`Constructing first geode bot at minute ${TIME - state.time + 1}`);
      }

      // if (state.bots.geode > 0) {
      //   console.log(`Collecting geode x${state.bots.geode} at minute ${TIME - state.time + 1}!`);
      // }

      const newState: GameState = {
        time: state.time - 1,
        bots: addResourceRecords(state.bots, order),
        resources: addResourceRecords(
          subtractResourceRecords(state.resources,
            getOrderCost(blueprint, order)
          ),
          state.bots,
        ),
      };
      const score = getGuaranteedScore(newState);
      const possibleScore = getHypotheticalScore(newState);
      const key = stateKey(newState);
      // console.log('new state', json(newState), order);
      // console.log('new? | better?', seen.has(key), seen.has(key) ? seen.get(key) < score : null);
      if (!seen.has(key) || score > seen.get(key)) {
        // if (possibleScore <= best.score) {
        //   // console.log('hypothetical score less than guaranteed - skipping')
        //   console.groupEnd();
        //   return;
        // }
        // console.log('pushing new state', json(newState));
        if (newState.time > 0 && (newState.bots.geode || 0) >= (best.state.bots.geode || 0)) {
          seen.set(key, score);
          states.push([getEvalScore(newState), getGuaranteedScore(newState), newState]);
          // states = binaryInsert<[number, number, GameState]>(states, [getEvalScore(newState), getGuaranteedScore(newState), newState], ([evalScore]) => evalScore);
        }
      }
      // console.log('best?', score > best.score);
      if (score > best.score) {
        best = {
          state: newState,
          score,
        };
      }
      console.groupEnd();
    });
    console.groupEnd();
  }

  console.log('best seen', best);

  return best.state;
}

export const execute: Execute = (blueprints) => {
  // start w/ naive 'build bots as soon as possible' approach - I know this won't work for all blueprints, but need to start somewhere

  const endStates = blueprints.slice(0, 2).reduce(
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
    toInt(blueprintID) * (endState.resources.geode || 0)
  );

  console.log('qualityLevels', qualityLevels);

  return sum(qualityLevels);
}