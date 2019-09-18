import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Background } from './components/background.js';
import { Loading } from './loading/index.js';
import { Screen } from './screen/index.js';

import { loadData } from './data/actions.js';

import './app.css';

export class App extends Component {
  constructor(props) {
    super(props);

    this.props.dispatch(loadData());
  }
  render() {
    return (
      <>
        <Background />
        <Loading />
        <Screen />
      </>
    );
  }
}
App = connect()(App);
