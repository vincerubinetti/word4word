import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { BigButton } from '../components/big-button.js';
import { Wiggle } from '../components/wiggle.js';
import { setScreen } from '../screen/actions.js';

import './index.css';

export class Home extends Component {
  render() {
    return (
      <>
        <h1 className='wiggle_hitbox' data-wiggle>
          <Wiggle text='WORD4WORD' />
        </h1>
        <div className='section section_v'>
          <BigButton
            onClick={() =>
              this.props.dispatch(setScreen({ screen: 'new-game' }))
            }
            left={<i className='fas fa-bolt' />}
            right='NEW GAME'
          />
          <BigButton
            onClick={() =>
              this.props.dispatch(setScreen({ screen: 'continue' }))
            }
            left={<i className='fas fa-bookmark' />}
            right='CONTINUE'
          />
          <BigButton
            onClick={() =>
              this.props.dispatch(setScreen({ screen: 'completed' }))
            }
            left={<i className='fas fa-star' />}
            right='COMPLETED'
          />
          <BigButton
            onClick={() =>
              this.props.dispatch(setScreen({ screen: 'dictionary' }))
            }
            left={<i className='fas fa-book' />}
            right='DICTIONARY'
          />
        </div>
      </>
    );
  }
}
Home = connect()(Home);
