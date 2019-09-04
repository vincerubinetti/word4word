import React from 'react';
import { Component } from 'react';

import { Background } from './components/background.js';
import { ActiveScreen } from './active-screen.js';

import { Dictionary } from './data/dictionary.js';

import './app.css';

export class App extends Component {
  render() {
    return (
      <>
        <Background />
        <ActiveScreen />
      </>
    );
  }
}

window.dictionary = new Dictionary();