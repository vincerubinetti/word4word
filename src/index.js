import React from 'react';
import { render } from 'react-dom';
import { createStore } from 'redux';
import { applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';

import { reducer } from './reducer.js';
import { logger } from './redux/logger.js';
import { persister } from './redux/persister';
import { getInitialState } from './redux/persister';
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
