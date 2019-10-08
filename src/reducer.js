import { copyObject } from './util/object.js';

import { data } from './data/reducers.js';
import { background } from './background/reducers.js';
import { screen } from './screen/reducers.js';

export function reducer(state = {}, action) {
  const newState = copyObject(state);

  return {
    data: data(newState.data, action),
    background: background(newState.background, action),
    screen: screen(newState.screen, action)
  };
}
