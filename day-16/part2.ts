import { Execute } from './format';
import { Valve, ValveID } from './shared';
import rfdc from '@utils/rfdc';

type Participant = {
  location: ValveID,
  path: ValveID[],
}

type State = {
  time: number,
  open: ValveID[],
  released: number,
  participants: Record<'me' | 'elephant', Participant>,
}

const TIME = 26;
let NODES: Record<ValveID, Valve> = {};
let VALVES: Record<ValveID, Valve> = {};
let PATHS: Record<string, ValveID[]> = {};

const PATHS_TO_FOLLOW = [
  ["DD:elephant","JJ:me"]
]

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

const pathsFor = (state: State, participant: Participant): ValveID[][] => {
  // todo: prevent duplicate targets
  const existingTargets = Object.values(state.participants)
    .map((participant: Participant) => participant.path)
    .filter((path) => path && path.length > 0)
    .map((path) => path[path.length - 1]);

  const validTargets = Object.keys(VALVES)
    .filter((valveID) =>
      !state.open.map(_ => _.split(':')[0] || '').includes(valveID)
      && !existingTargets.includes(valveID) // && valveID !== state.location
    );

  return validTargets.map((target) =>
    getShortestPath(participant.location, target)
  )
    .filter((path) => path.length - 1 < state.time);
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
    open: [],
    released: 0,
    participants: {
      me: {
        location: 'AA',
        path: null,
      },
      elephant: {
        location: 'AA',
        path: null,
      },
    }
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

    // console.log('eval', state.time, state.released, best.released, stack.length);

    if (lastLogged > state.time) {
      console.log(`First state for min ${TIME - state.time + 1} - ${stack.length + 1} states`);
      lastLogged = state.time;
    }

    // if (PATHS_TO_FOLLOW[0].every((part, i) => {
    //   return state.open.map(_ => _.split(':')[0] + ':' + _.split(':')[2]).indexOf(part) === i
    // })) {
    //   console.log('tracked state', state.time, state);
    // }

    const pairs = Object.entries(state.participants)
      .map(([participant, { path, location }]) => {
        if (path) {
          return {
            ...state.participants,
            [participant]: {
              location,
              path,
            }
          }
        } else {
          return pathsFor(state, { path, location })
            .filter((newPath) => {
              const target = newPath[newPath.length - 1];
              const additionalRelease = VALVES[target].rate * (state.time - newPath.length - 1);

              return state.released + additionalRelease >= best.released;
            })
            .map((newPath) => {
              return {
                ...state.participants,
                [participant]: {
                  location,
                  path: newPath,
                }
              }
            })
        }
      })
      .flat();

    console.log(`pairs`, pairs.length, pairs);

    if (pairs.length > 1) {
      pairs.forEach((pair) => {
        pushState({
          ...rfdc(state),
          participants: {
            me: {
              location: state.participants.me.location,
              path: pair.me.path,
            },
            elephant: {
              location: state.participants.elephant.location,
              path: pair.elephant.path,
            },
          },
        });
      });
      continue;
    }

    Object.entries(state.participants).forEach(([key, participant]) => {
      let newState: State;

      if (participant.path.length === 0) {
        // console.log(`reached ${target}, opening.`)
        const isOpen = state.open.map(_ => _.split(':')[0] || '').includes(participant.location);

        if (!isOpen) {
          newState = {
            ...rfdc(state),
            participants: {
              ...state.participants,
              [key]: {
                path: null,
                location: participant.location,
              },
            },
            time: state.time - 1,
            open: [...state.open, `${participant.location}:${TIME - state.time + 1}:${key}`],
            released: state.released + VALVES[participant.location].rate * (state.time - 1),
          };
        } else {
          // prune if duplicate target
          return;
        }
      } else {
        newState = {
          ...rfdc(state),
          time: state.time - 1,
          participants: {
            ...state.participants,
            [key]: {
              location: participant.path[0],
              path: participant.path.slice(1),
            },
          },
        };
      }

      // const target = state.path[state.path.length - 1];
      // const duration = state.path.length;
      // const newTime = state.time - duration;
      //
      // const newState: State = {
      //   time: newTime,
      //   path: null,
      //   location: target,
      //   open: [...state.open, `${target}:${TIME - newTime + 1}`],
      //   released: state.released + VALVES[target].rate * newTime,
      // };

      pushState(newState);
    });
  }

  console.log('best state found', best);

  return best.released;
}