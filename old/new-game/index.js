import React from 'react';
import { Component } from 'react';

import { Header } from './header.js';
import { Buttons } from './buttons.js';

import './index.css';

export class NewGame extends Component {
  render() {
    return (
      <>
        <Header />
        <Buttons />
      </>
    );
  }
}
