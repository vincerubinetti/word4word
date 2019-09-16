import { copyObject } from '../util/object.js';

export function reducer(state = {}, action) {
  const newState = copyObject(state);

  return {
    loadProgress: loadProgress(newState.loadProgress, action),
    screen: screen(newState.screen, action)
  };
}

function loadProgress(state = {}, action) {
  const newState = state;
  switch (action.type) {
    case 'set_load_progress':
      if (action.payload.loaded && action.payload.total) {
        newState[action.payload.id] = {
          loaded: action.payload.loaded,
          total: action.payload.total
        };
      }

    default:
      break;
  }

  if (typeof newState !== 'object')
    newState = {};

  return newState;
}

function screen(state = 'home', action) {
  let newState = state;
  switch (action.type) {
    case 'set_screen':
      newState = action.payload.screen;
      break;

    default:
      break;
  }

  if (typeof newState !== 'string' || !newState)
    newState = 'home';

  return newState;
}
