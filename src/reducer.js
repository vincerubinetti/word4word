import { copyObject } from './util/object.js';

import { data } from './data/reducers.js';
import { loading } from './loading/reducers.js';
import { screen } from './screen/reducers.js';

export function reducer(state = {}, action) {
  const newState = copyObject(state);

  return {
    data: data(newState.data, action),
    loading: loading(newState.loading, action),
    screen: screen(newState.screen, action)
  };
}
