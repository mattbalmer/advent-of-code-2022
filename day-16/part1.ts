import { Execute } from './format';
import { Valve, ValveID } from './shared';

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
      PATHS[`${origin},${to}`] = path.slice(1);
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
      !state.open.map(_ => _.split(':')[0] || '').includes(valveID) && valveID !== state.location
    );

  const paths = targets.map((target) =>
    getShortestPath(state.location, target)
  );

  return paths;
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

  let best: string = JSON.stringify(initial);

  const states = new Map<string, number>();
  let stack: State[] = [initial];
  let lastLogged = TIME + 1;

  while (stack.length > 0) {
    const state = stack.shift();
    const stateKey = statekey(state);
    if (states.has(stateKey)) {
      states.delete(stateKey);
    }

    if (state.time < 1) {
      if (state.released > JSON.parse(best).released) {
        // console.log(`new best (no time)`, state);
        best = JSON.stringify(state);
      }
      continue;
    }

    if (lastLogged > state.time) {
      console.log(`First state for min ${TIME - state.time + 1} - ${stack.length + 1} states`);
      lastLogged = state.time;
    }

    // if (state.open.map(_ => _.split(':')[0] || '').every((l, i) => (PATHS_TO_FOLLOW[0][i] || null) === l)) {
    //   console.log(state.time, state);
    // }

    if (state.path) {
      let newState: State;

      if (state.path.length === 0) {
        // console.log(`reached ${target}, opening.`)
        newState = {
          time: state.time - 1,
          path: null,
          location: state.location,
          open: [...state.open, `${state.location}:${TIME - state.time + 1}`],
          released: state.released + VALVES[state.location].rate * (state.time - 1),
        };
      } else {
        newState = {
          time: state.time - 1,
          location: state.path[0],
          path: state.path.slice(1),
          open: [...state.open],
          released: state.released,
        };
      }

      const newStateKey = statekey(newState);

      if (!states.has(newStateKey) || states.get(newStateKey) < newState.released) {
        states.set(newStateKey, newState.released);
        stack.push(newState);
      }
    } else {
      const targets = pathsFor(state);

      // console.log(`targets for`, state, targets);

      if (targets.length < 1) {
        if (state.released > JSON.parse(best).released) {
          // console.log(`new best (no targets)`, state);
          best = JSON.stringify(state);
        }
        // console.log(`No remaining targets`, JSON.stringify(state, null, 2));
      }

      // .sort((a, b) => valves[b].rate - valves[a].rate)
      targets.forEach((path) => {
        const newState: State = {
          released: state.released,
          open: state.open.slice(0),
          location: state.location,
          path,
          time: state.time,
        };
        const newStateKey = statekey(newState);

        if (!states.has(newStateKey) || states.get(newStateKey) < newState.released) {
          states.set(newStateKey, newState.released);
          stack.push(newState);
        }
      });
    }
  }

  console.log('best state found', best);

  return JSON.parse(best).released;
}