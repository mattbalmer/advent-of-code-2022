import { Execute } from './format';
import { Valve, ValveID } from './shared';
import rfdc from '@utils/rfdc';

type State = {
  time: number,
  location: ValveID,
  open: ValveID[],
  released: number,
  path: ValveID[],
}

const TIME = 30;
let NODES: Record<ValveID, Valve> = {};
let VALVES: Record<ValveID, Valve> = {};
let PATHS: Record<string, ValveID[]> = {};

// const PATHS_TO_FOLLOW = [
//   ["DD","BB","JJ","HH","EE","CC"]
// ]

const statekey = ({
  released,
  ...state
}: State) => JSON.stringify(state);

const getShortestPath = (origin: ValveID, to: ValveID): ValveID[] => {
  if (PATHS[`${origin},${to}`]) {
    return PATHS[`${origin},${to}`];
  }

  let stack: ValveID[][] = [
    [origin]
  ];

  while (stack.length > 0) {
    const path = stack.shift();

    const current = path[path.length - 1];

    if (current === to) {
      PATHS[`${origin},${to}`] = path; //.slice(1);
      return PATHS[`${origin},${to}`];
    }

    const neighbors = NODES[current].connections;

    neighbors.forEach((neighbor) => {
      if (!path.includes(neighbor)) {
        stack.push([...path, neighbor]);
      }
    });
  }
}

const pathsFor = (state: State): ValveID[][] => {
  const targets = Object.keys(VALVES)
    .filter((valveID) =>
      !state.open.map(_ => _.split(':')[0] || '').includes(valveID) // && valveID !== state.location
    );

  return targets.map((target) =>
    getShortestPath(state.location, target)
  )
    .filter((path) => path.length < state.time);
}

export const execute: Execute = (valvelist) => {
  console.log('valves', valvelist.length);

  NODES = valvelist
    .reduce((valves, valve) => ({
      ...valves,
      [valve.id]: valve,
    }), {});

  VALVES = valvelist
    .filter((valve) => valve.rate > 0)
    .reduce((valves, valve) => ({
      ...valves,
      [valve.id]: valve,
    }), {});

  console.log('valves', Object.keys(VALVES).length, VALVES);

  Object.keys(VALVES).forEach((a) => {
    Object.keys(VALVES).forEach((b) => {
      if (a !== b) {
        const path = getShortestPath(a, b);
        console.log(`Path: ${a} -> ${b}: ${path.join(', ')}`);
        PATHS[`${a},${b}`] = path;
      }
    });
  });

  console.log('paths calulated');

  const initial: State = {
    time: TIME,
    location: 'AA',
    open: [],
    released: 0,
    path: null,
  };

  let best: State = rfdc(initial);

  const states = new Map<string, number>();
  let stack: State[] = [initial];
  let lastLogged = TIME + 1;

  const pushState = (state: State) => {
    const newStateKey = statekey(state);

    if (state.time < 0) {
      return;
    }

    if (state.released > best.released) {
      // console.log(`new best (no time)`, state);
      best = rfdc(state);
    }

    if (!states.has(newStateKey) || states.get(newStateKey) < state.released) {
      states.set(newStateKey, state.released);
      stack.push(state);
    }
  }

  while (stack.length > 0) {
    const state = stack.shift();
    const stateKey = statekey(state);
    if (states.has(stateKey)) {
      states.delete(stateKey);
    }

    console.log('eval', state.time, state.released, best.released, stack.length);

    // if (lastLogged > state.time) {
    //   console.log(`First state for min ${TIME - state.time + 1} - ${stack.length + 1} states`);
    //   lastLogged = state.time;
    // }

    // if (state.open.map(_ => _.split(':')[0] || '').every((l, i) => (PATHS_TO_FOLLOW[0][i] || null) === l)) {
    //   console.log(state.time, state);
    // }

    if (state.path) {
      const target = state.path[state.path.length - 1];
      const duration = state.path.length;
      const newTime = state.time - duration;

      const newState: State = {
        time: newTime,
        path: null,
        location: target,
        open: [...state.open, `${target}:${TIME - newTime + 1}`],
        released: state.released + VALVES[target].rate * newTime,
      };

      pushState(newState);
    } else {
      const targets = pathsFor(state);

      // console.log(`targets for`, state, targets);
      // .sort((a, b) => valves[b].rate - valves[a].rate)
      targets.forEach((path) => {
        const target = path[path.length - 1];
        const additionalRelease = VALVES[target].rate * (state.time - path.length);

        if (state.released + additionalRelease < best.released) {
          console.log('prune');
          return;
        }

        const newState: State = {
          ...rfdc(state),
          path,
        };

        pushState(newState);
      });
    }
  }

  console.log('best state found', best);

  return best.released;
}