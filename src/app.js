import React from 'react';

import Data from './data';
import Background from './components/background';
import Screen from './screens';

import './app.css';

export default () => (
  <>
    <Background />
    <Data>
      <Screen />
    </Data>
  </>
);
