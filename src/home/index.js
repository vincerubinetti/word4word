import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { IconButton } from '../components/icon-button.js';
import { Wiggle } from '../components/wiggle.js';
import { setScreen } from '../screen/actions.js';

import './index.css';

export class Home extends Component {
  render() {
    return (
      <>
        <h1 className='wiggle_hitbox'>
          <Wiggle text='WORD4WORD' />
        </h1>
        <IconButton
          className='wiggle_hitbox'
          onClick={() => this.props.dispatch(setScreen({ screen: 'new-game' }))}
          left={<i className='fas fa-bolt' />}
          right={<Wiggle text='NEW GAME' />}
        />
        <IconButton
          className='wiggle_hitbox'
          onClick={() => this.props.dispatch(setScreen({ screen: 'continue' }))}
          left={<i className='fas fa-bookmark' />}
          right={<Wiggle text='CONTINUE' />}
        />
        <IconButton
          className='wiggle_hitbox'
          onClick={() =>
            this.props.dispatch(setScreen({ screen: 'completed' }))
          }
          left={<i className='fas fa-star' />}
          right={<Wiggle text='COMPLETE' />}
        />
        <IconButton
          className='wiggle_hitbox'
          onClick={() =>
            this.props.dispatch(setScreen({ screen: 'dictionary' }))
          }
          left={<i className='fas fa-book' />}
          right={<Wiggle text='DICTIONARY' />}
        />
      </>
    );
  }
}
Home = connect()(Home);
