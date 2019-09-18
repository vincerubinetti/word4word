import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import posed from 'react-pose';
import { PoseGroup } from 'react-pose';

import { Home } from '../home/index.js';
import { NewGame } from '../new-game/index.js';
import { Dictionary } from '../dictionary/index.js';

import './index.css';

const PosedDiv = posed.div({
  enter: {
    opacity: 1,
    transform: 'scale(1)',
    transition: { type: 'tween', duration: 250 }
  },
  exit: {
    opacity: 0,
    transform: 'scale(1.1)',
    transition: { type: 'tween', duration: 250 }
  }
});

export class Screen extends Component {
  render() {
    return (
      <PoseGroup>
        {this.props.screen === 'home' && (
          <PosedDiv className='screen' key={1}>
            <Home />
          </PosedDiv>
        )}
        {this.props.screen === 'new-game' && (
          <PosedDiv className='screen' key={2}>
            <NewGame />
          </PosedDiv>
        )}
        {this.props.screen === 'dictionary' && (
          <PosedDiv className='screen' key={3}>
            <Dictionary />
          </PosedDiv>
        )}
      </PoseGroup>
    );
  }
}
Screen = connect((state) => ({
  screen: state.screen
}))(Screen);
