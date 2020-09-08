import React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';

import { Button } from '../components/button.js';
import { Wiggle } from '../components/wiggle.js';
import { setScreen } from '../screen/actions.js';

import './index.css';

export class Header extends Component {
  render() {
    return (
      <div className='section'>
        <Button
          className='header_button'
          onClick={() => this.props.dispatch(setScreen({ screen: 'home' }))}
        >
          <i className='fas fa-lg fa-chevron-left'></i>
        </Button>
        <h2 className='wiggle_hitbox' data-wiggle>
          <Wiggle text='New Game' />
        </h2>
      </div>
    );
  }
}
Header = connect()(Header);
