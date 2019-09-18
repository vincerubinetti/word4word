import React from 'react';
import { Component } from 'react';

import { Wiggle } from '../components/wiggle.js';
import { Table } from './table.js';

import './index.css';

export class Dictionary extends Component {
  render() {
    return (
      <>
        <div className='screen_top'>
          <h2 className='wiggle_hitbox'><Wiggle text="Dictionary"/></h2>
        </div>
        <div className='screen_middle'>
          <Table />
        </div>
        <div className='screen_bottom'></div>
      </>
    );
  }
}
