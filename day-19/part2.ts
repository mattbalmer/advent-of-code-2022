import { Execute } from './format';
import {
  Blueprint,
  Resource,
  ResourceRecord,
} from './shared';
import { mult } from '@utils/array';

const json = (val) => JSON.stringify(val, null, 2);

const TIME = 32;
const STATES_CAP = 100_000;

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

const maxOf = (blueprint: Blueprint, resource: Resource): number =>
  Math.max(
    ...Object.values(blueprint.robots)
      .map((cost) => cost[resource] || 0)
  )

const scoreFor = (state: GameState): number => {
  return state.resources.geode + (state.bots.geode / 2) +
    (state.resources.obsidian + state.bots.obsidian) / 10 +
    (state.resources.clay + state.bots.clay) / 100 +
    (state.resources.ore + state.bots.ore) / 1000
  ;
}

const executeBlueprint = (blueprint: Blueprint): GameState => {
  console.log('eval blueprint', json(blueprint));

  const initialState: GameState = {
    resources: {
      ore: 0,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    bots: {
      ore: 1,
      clay: 0,
      obsidian: 0,
      geode: 0,
    },
    time: TIME,
  };

  const Maximums: Partial<ResourceRecord> = {
    ore: maxOf(blueprint, 'ore'),
    clay: maxOf(blueprint, 'clay'),
    obsidian: maxOf(blueprint, 'obsidian'),
  };

  let best: GameState = initialState;

  let currentStates = new Map<string, {
    state: GameState,
    score: number,
  }>([
    [stateKey(initialState), {
      state: initialState,
      score: scoreFor(initialState),
    }]
  ]);
  let nextStates = new Map<string, {
    state: GameState,
    score: number,
  }>();

  while (currentStates.size > 0) {
    // let geodeBotBuilt = false;
    let logFirst = false;

    currentStates.forEach(({ state }) => {
      if (!logFirst) {
        logFirst = true;
        console.log(`minute ${TIME - state.time + 1} - ${currentStates.size} states`);
      }

      let possibleBots: Resource[] = HIERARCHY.filter((resource) =>
          Maximums[resource] ? state.bots[resource] < Maximums[resource] : true
        );

      possibleBots.forEach((resource) => {
        const cost = blueprint.robots[resource];
        let canAfford = true;
        const resourcesAfterPurchase = {} as ResourceRecord;

        for(const [costResource, amount] of Object.entries(cost)) {
          resourcesAfterPurchase[costResource] = state.resources[costResource] - amount;
          if (resourcesAfterPurchase[costResource] < 0) {
            canAfford = false;
            break;
          }
        }

        if (canAfford) {

          const nextState: GameState = {
            time: state.time - 1,
            resources: {
              ore: resourcesAfterPurchase.ore + state.bots.ore,
              clay: resourcesAfterPurchase.clay + state.bots.clay,
              obsidian: resourcesAfterPurchase.obsidian + state.bots.obsidian,
              geode: resourcesAfterPurchase.geode + state.bots.geode,
            },
            bots: {
              ...state.bots,
              [resource]: state.bots[resource] + 1,
            }
          };

          if (nextState.time > 0) {
            nextStates.set(stateKey(nextState), {
              state: nextState,
              score: scoreFor(nextState),
            });
          } else if (nextState.resources.geode > best.resources.geode) {
            best = nextState;
          }
        }
      });

      const nextState = {
        time: state.time - 1,
        resources: {
          ore: state.resources.ore + state.bots.ore,
          clay: state.resources.clay + state.bots.clay,
          obsidian: state.resources.obsidian + state.bots.obsidian,
          geode: state.resources.geode + state.bots.geode,
        },
        bots: { ...state.bots }
      };

      if (nextState.time > 0) {
        nextStates.set(stateKey(nextState), {
          state: nextState,
          score: scoreFor(nextState),
        });
      } else if (nextState.resources.geode > best.resources.geode) {
        best = nextState;
      }
    });


    currentStates = new Map<string, {
      state: GameState,
      score: number,
    }>(
      nextStates.size > STATES_CAP
        ? Array.from(nextStates)
          .sort(([, a], [, b]) =>
            b.score - a.score
          )
          .slice(0, STATES_CAP)
        : nextStates
    );
    nextStates = new Map<string, {
      state: GameState,
      score: number,
    }>();
  }

  console.log('best seen', best);

  return best;
}

export const execute: Execute = (blueprints) => {
  // start w/ naive 'build bots as soon as possible' approach - I know this won't work for all blueprints, but need to start somewhere

  const endStates = blueprints.slice(0, 3).reduce(
    (results, blueprint) => ({
      ...results,
      [blueprint.id]: executeBlueprint(blueprint),
    }),
    {} as Record<number, GameState>
  );

  console.log('endStates',
    JSON.stringify(endStates, null, 2)
  );

  return mult(
    Object.values(endStates).map((endState) => endState.resources.geode)
  );
}