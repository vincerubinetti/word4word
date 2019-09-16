import { copyObject } from '../util/object.js';

export function reducer(state = {}, action) {
  const newState = copyObject(state);

  return {
    screen: screen(newState.screen, action)
  };
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
