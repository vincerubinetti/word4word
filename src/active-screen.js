import React from 'react';
import { Component } from 'react';
import posed from 'react-pose';
import { PoseGroup } from 'react-pose';

import { Difficulty } from './difficulty/index.js';

const PosedDiv = posed.div({
  enter: {
    opacity: 1,
    y: 0,
    transition: { type: 'tween', duration: 500 }
  },
  exit: {
    opacity: 0,
    y: -100,
    transition: { type: 'tween', duration: 500 }
  }
});

export class ActiveScreen extends Component {
  constructor() {
    super();

    this.state = {};
    this.state.screen = '';

    window.setInterval(this.testSwitchScreen, 2000);
  }

  testSwitchScreen = () => {
    if (this.state.screen)
      this.setState({ screen: '' });
    else
      this.setState({ screen: 'difficulty' });
  };

  render() {
    return (
      <PoseGroup>
        {this.state.screen === 'difficulty' && (
          <PosedDiv key={0}>
            <Difficulty />
          </PosedDiv>
        )}
      </PoseGroup>
    );
  }
}
