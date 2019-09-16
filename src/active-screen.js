import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import posed from 'react-pose';
import { PoseGroup } from 'react-pose';

import { Home } from './home/index.js';
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
  render() {
    return (
      <PoseGroup>
        {this.props.screen === 'home' && (
          <PosedDiv key={0}>
            <Home />
          </PosedDiv>
        )}
        {this.props.screen === 'difficulty' && (
          <PosedDiv key={1}>
            <Difficulty />
          </PosedDiv>
        )}
      </PoseGroup>
    );
  }
}
ActiveScreen = connect((state) => ({
  screen: state.screen
}))(ActiveScreen);
