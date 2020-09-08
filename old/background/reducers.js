export function background(state = 0, action) {
  let newState = state;
  switch (action.type) {
    case 'set_background':
      newState = action.payload.background;
      break;

    default:
      break;
  }

  if (typeof newState !== 'number' || !newState)
    newState = 0;

  return newState;
}
