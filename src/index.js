import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { reducer } from './state/reducers.js';
import { logger } from './state/logger.js';
import { persister } from './state/persister';
import { getInitialState } from './state/persister';
import { App } from './app.js';

export const store = createStore(
  reducer,
  getInitialState(),
  applyMiddleware(thunk, persister, logger)
);

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
